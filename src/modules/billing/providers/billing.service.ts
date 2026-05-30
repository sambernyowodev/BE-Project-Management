import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Billing } from '../entities/billing.entity';
import { BillingDetail } from '../entities/billing-detail.entity';
import { Project } from '../../projects/entities/project.entity';
import { ProjectMember } from '../../projects/entities/project-member.entity';
import { RoleRate } from '../../master/role-rates/entities/role-rate.entity';
import { SupportTicket } from '../../support-tickets/entities/support-ticket.entity';
import { ProjectActivity } from '../../project-activities/entities/project-activity.entity';
import { GenerateBillingDto } from '../dto/billing.dto';
import { BaseResponseDto } from '../../../common/dtos/response.dto';
import { BillingResponseDto } from '../dto/billing-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private readonly billingRepo: Repository<Billing>,
    @InjectRepository(BillingDetail)
    private readonly detailRepo: Repository<BillingDetail>,
    @InjectRepository(RoleRate)
    private readonly roleRateRepo: Repository<RoleRate>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    @InjectRepository(SupportTicket)
    private readonly ticketRepo: Repository<SupportTicket>,
    @InjectRepository(ProjectActivity)
    private readonly activityRepo: Repository<ProjectActivity>,
  ) { }

  async generatePreview(dto: GenerateBillingDto): Promise<BaseResponseDto<any>> {
    const isProjectType = dto.billingType === 'PROJECT';
    const isSupportType = dto.billingType === 'SUPPORT';

    const hasProjectIds = isProjectType && dto.projectIds && dto.projectIds.length > 0;
    const hasSupportTicketIds = isSupportType && dto.supportTicketIds && dto.supportTicketIds.length > 0;

    if (!hasProjectIds && !hasSupportTicketIds) {
      throw new NotFoundException(`No valid items found for ${dto.billingType} billing type`);
    }

    let projects: Project[] = [];
    if (hasProjectIds) {
      projects = await this.projectRepo.find({
        where: { id: In(dto.projectIds || []) },
        relations: { project: true }
      });
    }

    const rates = await this.roleRateRepo.find({
      where: { isActive: true },
      relations: { role: true },
    });

    const rateMap = new Map<number, RoleRate>();
    for (const rate of rates) {
      rateMap.set(Number(rate.roleId), rate);
    }

    const detailItems = [];

    // 1. Process Standard Project members actual mandays
    if (hasProjectIds && projects.length > 0) {
      const members = await this.memberRepo.find({
        where: { projectId: In(dto.projectIds || []), isActive: true },
        relations: { role: true, user: true, project: true },
      });

      const projectMap = new Map<number, Project>();
      for (const p of projects) {
        projectMap.set(Number(p.id), p);
      }

      // Fetch activities for selected projects
      const rangeStart = new Date(dto.startDate);
      const rangeEnd = new Date(dto.endDate);

      const allActivities = await this.activityRepo.find({
        where: { projectId: In(dto.projectIds || []) },
      });

      const filteredActivities = allActivities.filter(act => {
        if (!act.startDate) return false;
        const actDate = new Date(act.startDate);
        return actDate >= rangeStart && actDate <= rangeEnd;
      });

      const groups: Record<string, { projectId: number, roleId: number, mandays: number, memberNames: string[] }> = {};
      for (const member of members) {
        const key = `${member.projectId}_${member.roleId}`;
        if (!groups[key]) {
          groups[key] = {
            projectId: Number(member.projectId),
            roleId: Number(member.roleId),
            mandays: 0,
            memberNames: [],
          };
        }

        // Calculate dynamic mandays from activities in the selected period
        const memberActivities = filteredActivities.filter(
          act => Number(act.assignedToId) === Number(member.userId) && Number(act.projectId) === Number(member.projectId)
        );
        const memberMandays = memberActivities.reduce((sum, act) => sum + Number(act.mandays || 0), 0);

        groups[key].mandays += memberMandays;
        if (member.user && member.user.fullName && !groups[key].memberNames.includes(member.user.fullName)) {
          groups[key].memberNames.push(member.user.fullName);
        }
      }

      for (const key of Object.keys(groups)) {
        const group = groups[key];
        // Only include groups with actual mandays in this period
        if (group.mandays <= 0) continue;

        const project = projectMap.get(group.projectId);
        const isSupport = project ? project.parentProjectId !== null : false;
        
        const roleRate = rateMap.get(group.roleId);
        const rate = roleRate 
          ? Number(isSupport ? roleRate.ratePerMandaySupport : roleRate.ratePerMandayProject)
          : 0;
          
        const subtotal = group.mandays * rate;
        detailItems.push({
          projectId: group.projectId,
          projectName: project?.project?.name || 'Unknown Project',
          roleId: group.roleId,
          roleName: roleRate?.role?.name || 'Unknown Role',
          memberNames: group.memberNames.join(', '),
          mandays: group.mandays,
          ratePerManday: rate,
          subtotal,
        });
      }
    }

    // 2. Process Support Tickets assignees hoursSpent -> mandays
    if (hasSupportTicketIds) {
      const supportTickets = await this.ticketRepo.find({
        where: { id: In(dto.supportTicketIds || []) },
        relations: { masterProject: true, assignees: { user: true, role: true } }
      });

      for (const ticket of supportTickets) {
        for (const assignee of ticket.assignees || []) {
          if (!assignee.roleId) continue;
          
          const mandays = Number(assignee.hoursSpent || 0) / 8;
          const roleRate = rateMap.get(Number(assignee.roleId));
          const rate = roleRate ? Number(roleRate.ratePerMandaySupport) : 0;
          const subtotal = mandays * rate;

          detailItems.push({
            projectId: ticket.masterProjectId ? Number(ticket.masterProjectId) : null,
            projectName: `[SUP] ${ticket.masterProject?.name || 'Unknown Project'} - ${ticket.ticketCode} (${ticket.issueTitle})`,
            roleId: Number(assignee.roleId),
            roleName: assignee.role?.name || 'Unknown Role',
            memberNames: assignee.user?.fullName || 'Unknown Member',
            mandays,
            ratePerManday: rate,
            subtotal,
          });
        }

        // Link ticket's corresponding Project to the billing header if it has one and is not already linked
        if (ticket.masterProjectId) {
          const mId = Number(ticket.masterProjectId);
          if (!projects.some(p => Number(p.id) === mId)) {
            const pEntity = await this.projectRepo.findOne({
              where: { id: mId },
              relations: { project: true }
            });
            if (pEntity) {
              projects.push(pEntity);
            }
          }
        }
      }
    }

    const totalMandays = detailItems.reduce((sum, item) => sum + item.mandays, 0);
    const totalAmount = detailItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      success: true,
      data: {
        projects,
        period: { start: dto.startDate, end: dto.endDate },
        roleBreakdown: detailItems,
        totalMandays,
        totalAmount,
        remarks: dto.remarks || '',
      }
    };
  }

  async createBilling(dto: GenerateBillingDto, userId: number): Promise<BaseResponseDto<BillingResponseDto>> {
    const previewRes = await this.generatePreview(dto);
    const preview = previewRes.data;

    const now = new Date();
    const prefix = `BILL-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-`;
    const lastBill = await this.billingRepo.createQueryBuilder('bill')
      .where('bill.billingNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('bill.billingNumber', 'DESC')
      .getOne();

    let nextNum = 1;
    if (lastBill && lastBill.billingNumber) {
      const sequence = parseInt(lastBill.billingNumber.split('-')[2], 10);
      if (!isNaN(sequence)) nextNum = sequence + 1;
    }
    const billingNumber = `${prefix}${nextNum.toString().padStart(3, '0')}`;

    const billing = this.billingRepo.create({
      billingNumber,
      billingType: dto.billingType,
      billingPeriodStart: new Date(dto.startDate),
      billingPeriodEnd: new Date(dto.endDate),
      totalMandays: preview.totalMandays,
      totalAmount: preview.totalAmount,
      remarks: dto.remarks || undefined,
      projects: preview.projects,
      createdBy: userId,
    });

    const savedBilling = await this.billingRepo.save(billing);

    const details = preview.roleBreakdown.map((r: any) => {
      return this.detailRepo.create({
        billingId: savedBilling.id,
        projectId: r.projectId,
        roleId: r.roleId,
        mandays: r.mandays,
        ratePerManday: r.ratePerManday,
        subtotal: r.subtotal,
      });
    });

    await this.detailRepo.save(details);
    return this.findOne(savedBilling.id);
  }

  async findAll(): Promise<BaseResponseDto<BillingResponseDto[]>> {
    const data = await this.billingRepo.find({ 
      relations: { projects: { project: true } } 
    });
    return { success: true, data: mapToDtoArray(BillingResponseDto, data) };
  }

  async findOne(id: number): Promise<BaseResponseDto<BillingResponseDto>> {
    const bill = await this.billingRepo.findOne({ 
      where: { id }, 
      relations: { projects: { project: true } } 
    });
    if (!bill) throw new NotFoundException('Billing record not found');
    const details = await this.detailRepo.find({ 
      where: { billingId: id },
      relations: { role: true, project: { project: true } }
    });
    const fullBilling = { ...bill, details };
    return { success: true, data: mapToDto(BillingResponseDto, fullBilling) };
  }
}

