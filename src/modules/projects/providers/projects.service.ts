import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource, In } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { Role } from '../../master/roles/entities/role.entity';
import { MasterProject } from '../../master/project/entities/project.entity';
import { MasterProjectsService } from '../../master/project/providers/projects.service';
import { ProjectStatus } from '../../../common/enums';

import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { PoProject } from '../../purchase-orders/entities/po-project.entity';
import { BillingInvoice } from '../../billing/entities/billing-invoice.entity';
import { BillingInvoiceDetail } from '../../billing/entities/billing-invoice-detail.entity';
import { SupportTicket } from '../../support-tickets/entities/support-ticket.entity';
import { SupportTicketAssignee } from '../../support-tickets/entities/support-ticket-assignee.entity';
import { ProjectActivity } from '../../project-activities/entities/project-activity.entity';
import { RoleRate } from '../../master/role-rates/entities/role-rate.entity';
import { PoMember } from '../../po-members/entities/po-member.entity';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto } from '../dto/project.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../common/dtos/response.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../common/utils/query.util';
import { ProjectResponseDto, ProjectMemberResponseDto } from '../dto/project-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    private readonly dataSource: DataSource,
    private readonly masterProjectsService: MasterProjectsService,
  ) { }

  async create(dto: CreateProjectDto, userId: number): Promise<BaseResponseDto<ProjectResponseDto>> {
    // Validate master project exists
    await this.masterProjectsService.findEntity(dto.projectId);

    const project = this.projectRepo.create({
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      actualStart: dto.actualStart ? new Date(dto.actualStart) : undefined,
      actualEnd: dto.actualEnd ? new Date(dto.actualEnd) : undefined,
      createdBy: userId,
    });

    const saved = await this.projectRepo.save(project);

    // Reload with relations
    const full = await this.projectRepo.findOne({
      where: { id: saved.id },
      relations: { project: true, parentProject: true },
    });

    return { success: true, data: mapToDto(ProjectResponseDto, full) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<ProjectResponseDto>> {
    const qb = this.projectRepo.createQueryBuilder('project')
      .leftJoinAndSelect('project.project', 'masterProject')
      .leftJoinAndSelect('project.parentProject', 'parentProject');

    applyPagination(qb, query, ['masterProject.name', 'picClient', 'status', 'customer'], {
      projectCode: 'masterProject.projectCode',
      name: 'masterProject.name',
    });

    const [projects, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    return {
      success: true,
      data: mapToDtoArray(ProjectResponseDto, projects),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number): Promise<BaseResponseDto<ProjectResponseDto>> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: { project: true, parentProject: true },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return { success: true, data: mapToDto(ProjectResponseDto, project) };
  }

  async update(id: number, dto: UpdateProjectDto): Promise<BaseResponseDto<ProjectResponseDto>> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);

    // If changing master project, validate it exists
    if (dto.projectId) {
      await this.masterProjectsService.findEntity(dto.projectId);
    }

    const updateData: any = { ...dto };
    if (dto.startDate !== undefined) {
      updateData.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }
    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }
    if (dto.actualStart !== undefined) {
      updateData.actualStart = dto.actualStart ? new Date(dto.actualStart) : null;
    }
    if (dto.actualEnd !== undefined) {
      updateData.actualEnd = dto.actualEnd ? new Date(dto.actualEnd) : null;
    }

    // Merge updates
    this.projectRepo.merge(project, updateData);
    const updated = await this.projectRepo.save(project);

    // Reload with relations
    const full = await this.projectRepo.findOne({
      where: { id: updated.id },
      relations: { project: true, parentProject: true },
    });

    return { success: true, data: mapToDto(ProjectResponseDto, full) };
  }

  async remove(id: number): Promise<BaseResponseDto<null>> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);

    await this.dataSource.transaction(async (manager) => {
      // 1. Get project member IDs to delete their po_members
      const members = await manager.find(ProjectMember, {
        where: { projectId: id },
        select: { id: true },
      }) as any[];
      const memberIds = members.map((m) => m.id);

      // Find affected POs before deleting members
      let poIds: number[] = [];
      if (memberIds.length > 0) {
        const poMembers = await manager.find(PoMember, {
          where: { projectMemberId: In(memberIds) },
        });
        poIds = Array.from(new Set(poMembers.map((pm) => pm.poId)));
      }

      // 2. Delete po_projects association
      await manager.delete(PoProject, { projectId: id });

      // 3. Delete po_members
      if (memberIds.length > 0) {
        await manager.delete(PoMember, { projectMemberId: In(memberIds) });
      }

      // 4. Delete billing_invoice_details and billing_invoices
      const invoices = await manager.find(BillingInvoice, {
        where: { projectId: id },
        select: { id: true },
      }) as any[];
      const invoiceIds = invoices.map((inv) => inv.id);
      if (invoiceIds.length > 0) {
        await manager.delete(BillingInvoiceDetail, { invoiceId: In(invoiceIds) });
        await manager.delete(BillingInvoice, { id: In(invoiceIds) });
      }

      // 5. Delete support_tickets and their details (those linked to this project's master_project)
      const masterProjectId = project.projectId;
      const tickets = await manager.find(SupportTicket, {
        where: { masterProjectId },
        select: { id: true },
      }) as any[];
      const ticketIds = tickets.map((t) => t.id);
      if (ticketIds.length > 0) {
        await manager.delete(SupportTicketAssignee, { supportTicketId: In(ticketIds) });
        await manager.delete(SupportTicket, { id: In(ticketIds) });
      }

      // 6. Delete project_activities
      await manager.delete(ProjectActivity, { projectId: id });

      // 7. Delete role_rates
      await manager.delete(RoleRate, { projectId: id });

      // 8. Delete child projects (support projects referencing this as parent)
      const childProjects = await manager.find(Project, {
        where: { parentProjectId: id },
        select: { id: true },
      }) as any[];
      for (const child of childProjects) {
        // Nullify parent reference
        await manager.update(Project, child.id, { parentProjectId: null as any });
      }

      // 9. Delete project_members
      await manager.delete(ProjectMember, { projectId: id });

      // 10. Delete the project itself
      await manager.delete(Project, { id });
    });

    return { success: true, data: null, message: 'Project deleted successfully' };
  }

  async addMember(
    projectId: number,
    dto: AddProjectMemberDto,
  ): Promise<BaseResponseDto<ProjectMemberResponseDto>> {
    await this.findOne(projectId); // verify exists

    const savedMember = await this.dataSource.transaction(async (manager) => {
      const member = manager.getRepository(ProjectMember).create({
        projectId,
        ...dto,
      });
      const saved = await manager.getRepository(ProjectMember).save(member);

      // Find if this project is assigned to any PO
      const poProjects = await manager.getRepository(PoProject).find({
        where: { projectId },
      });

      for (const pp of poProjects) {
        // Create PoMember for this PO if it doesn't exist
        let poMember = await manager.getRepository(PoMember).findOne({
          where: { poId: pp.poId, projectMemberId: saved.id, roleId: dto.roleId },
        });
        if (!poMember) {
          poMember = manager.getRepository(PoMember).create({
            poId: pp.poId,
            projectMemberId: saved.id,
            roleId: dto.roleId,
            actualMandays: 0,
            actualHours: 0,
            ratePerManday: 0,
            totalCost: 0,
            isBillable: true,
          });
          await manager.getRepository(PoMember).save(poMember);
        }
      }

      return saved;
    });

    return { success: true, data: mapToDto(ProjectMemberResponseDto, savedMember) };
  }

  async getMembers(projectId: number): Promise<BaseResponseDto<ProjectMemberResponseDto[]>> {
    const data = await this.memberRepo.find({
      where: { projectId },
      relations: { user: true, role: true },
    });
    return { success: true, data: mapToDtoArray(ProjectMemberResponseDto, data) };
  }

  async findOrCreateSupportProject(masterProjectName: string, userId?: number): Promise<Project> {
    // 1. Find or create the MasterProject
    let masterProject = await this.masterProjectsService.findByName(masterProjectName);
    if (!masterProject) {
      const projectCode = await this.masterProjectsService.generateProjectCode();
      const masterRepo = this.dataSource.getRepository(MasterProject);
      masterProject = masterRepo.create({
        name: masterProjectName,
        projectCode,
        isActive: true,
        createdBy: userId,
      });
      masterProject = await masterRepo.save(masterProject);
    }

    // 2. Find or create the Project linked to this master
    let project = await this.projectRepo.findOne({
      where: {
        projectId: masterProject.id,
      },
    });

    if (!project) {
      project = this.projectRepo.create({
        projectId: masterProject.id,
        status: ProjectStatus.PLANNING,
        createdBy: userId,
      });
      project = await this.projectRepo.save(project);
    }

    return project;
  }

  async ensureProjectMember(projectId: number, userId: number, roleCode: string): Promise<void> {
    // Find the Role
    const role = await this.dataSource.getRepository(Role).findOne({
      where: { code: roleCode },
    });
    if (!role) return;

    const existing = await this.memberRepo.findOne({
      where: { projectId, userId, roleId: role.id },
    });
    if (existing) return;

    const member = this.memberRepo.create({
      projectId,
      userId,
      roleId: role.id,
      isActive: true,
    });
    await this.memberRepo.save(member);
  }

  async removeMember(projectId: number, memberId: number): Promise<BaseResponseDto<null>> {
    const member = await this.memberRepo.findOne({
      where: { id: memberId, projectId },
    });
    if (!member) throw new NotFoundException(`Project member ${memberId} not found in project ${projectId}`);

    await this.dataSource.transaction(async (manager) => {
      // Find the POs associated with this project member
      const poMembers = await manager.find(PoMember, { where: { projectMemberId: memberId } });
      const poIds = Array.from(new Set(poMembers.map(pm => pm.poId)));

      // Delete references in po_members
      await manager.delete(PoMember, { projectMemberId: memberId });
      // Delete the project member
      await manager.remove(member);
    });

    return { success: true, data: null, message: 'Member removed successfully' };
  }
}
