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
import { SalesOrder } from '../../sales-orders/entities/sales-order.entity';
import { BillingInvoice } from '../../billing/entities/billing-invoice.entity';
import { BillingInvoiceDetail } from '../../billing/entities/billing-invoice-detail.entity';
import { SupportTicket } from '../../support-tickets/entities/support-ticket.entity';
import { SupportTicketDetail } from '../../support-tickets/entities/support-ticket-detail.entity';
import { ProjectActivity } from '../../project-activities/entities/project-activity.entity';
import { RoleRate } from '../../master/role-rates/entities/role-rate.entity';
import { PoSoMember } from '../../po-so-members/entities/po-so-member.entity';
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

    applyPagination(qb, query, ['masterProject.name', 'picClient', 'status', 'customer']);

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

    // Merge updates
    this.projectRepo.merge(project, dto);
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
      // 1. Get project member IDs to delete their po_so_members
      const members = await manager.find(ProjectMember, {
        where: { projectId: id },
        select: { id: true },
      }) as any[];
      const memberIds = members.map((m) => m.id);

      // 2. Get purchase order IDs and sales order IDs to delete their po_so_members
      const purchaseOrders = await manager.find(PurchaseOrder, {
        where: { projectId: id },
        select: { id: true },
      }) as any[];
      const poIds = purchaseOrders.map((po) => po.id);

      const salesOrders = await manager.find(SalesOrder, {
        where: { projectId: id },
        select: { id: true },
      }) as any[];
      const soIds = salesOrders.map((so) => so.id);

      // 3. Delete po_so_members
      if (memberIds.length > 0) {
        await manager.delete(PoSoMember, { projectMemberId: In(memberIds) });
      }
      if (poIds.length > 0) {
        await manager.delete(PoSoMember, { poId: In(poIds) });
      }
      if (soIds.length > 0) {
        await manager.delete(PoSoMember, { soId: In(soIds) });
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

      // 5. Delete sales_orders
      if (soIds.length > 0) {
        await manager.delete(SalesOrder, { id: In(soIds) });
      }

      // 6. Delete purchase_orders
      if (poIds.length > 0) {
        await manager.delete(PurchaseOrder, { id: In(poIds) });
      }

      // 7. Delete support_tickets and their details (those linked to this project's master_project)
      const masterProjectId = project.projectId;
      const tickets = await manager.find(SupportTicket, {
        where: { masterProjectId },
        select: { id: true },
      }) as any[];
      const ticketIds = tickets.map((t) => t.id);
      if (ticketIds.length > 0) {
        await manager.delete(SupportTicketDetail, { supportTicketId: In(ticketIds) });
        await manager.delete(SupportTicket, { id: In(ticketIds) });
      }

      // 8. Delete project_activities
      await manager.delete(ProjectActivity, { projectId: id });

      // 9. Delete role_rates
      await manager.delete(RoleRate, { projectId: id });

      // 10. Delete child projects (support projects referencing this as parent)
      const childProjects = await manager.find(Project, {
        where: { parentProjectId: id },
        select: { id: true },
      }) as any[];
      for (const child of childProjects) {
        // Nullify parent reference
        await manager.update(Project, child.id, { parentProjectId: null as any });
      }

      // 11. Delete project_members
      await manager.delete(ProjectMember, { projectId: id });

      // 12. Delete the project itself
      await manager.delete(Project, { id });
    });

    return { success: true, data: null, message: 'Project deleted successfully' };
  }

  async addMember(
    projectId: number,
    dto: AddProjectMemberDto,
  ): Promise<BaseResponseDto<ProjectMemberResponseDto>> {
    await this.findOne(projectId); // verify exists

    const member = this.memberRepo.create({
      projectId,
      ...dto,
    });
    const saved = await this.memberRepo.save(member);
    return { success: true, data: mapToDto(ProjectMemberResponseDto, saved) };
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
      // Delete references in po_so_members
      await manager.delete(PoSoMember, { projectMemberId: memberId });
      // Delete the project member
      await manager.remove(member);
    });

    return { success: true, data: null, message: 'Member removed successfully' };
  }
}
