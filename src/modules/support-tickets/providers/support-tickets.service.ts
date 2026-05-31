import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SupportTicket } from '../entities/support-ticket.entity';
import { SupportTicketAssignee } from '../entities/support-ticket-assignee.entity';
import { MasterProject } from '../../master/project/entities/project.entity';
import { MasterProjectsService } from '../../master/project/providers/projects.service';
import { ProjectsService } from '../../projects/providers/projects.service';
import {
  CreateSupportTicketDto,
  CreateSupportTicketAssigneeDto,
  UpdateSupportTicketAssigneeDto,
  UpdateSupportTicketDto,
} from '../dto/support-ticket.dto';
import {
  BaseResponseDto,
  PaginatedResponseDto,
  SuccessResponseDto,
} from '../../../common/dtos/response.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../common/utils/query.util';
import { SupportTicketResponseDto } from '../dto/support-ticket-response.dto';
import { SupportTicketAssigneeResponseDto } from '../dto/support-ticket-assignee-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepo: Repository<SupportTicket>,
    @InjectRepository(SupportTicketAssignee)
    private readonly assigneeRepo: Repository<SupportTicketAssignee>,
    private readonly dataSource: DataSource,
    private readonly masterProjectsService: MasterProjectsService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(
    dto: CreateSupportTicketDto,
    userId?: number,
  ): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    let masterProjectId = dto.masterProjectId;

    // If no masterProjectId provided but masterProjectName given, find or create
    if (!masterProjectId && dto.masterProjectName) {
      let masterProject = await this.masterProjectsService.findByName(
        dto.masterProjectName,
      );
      if (!masterProject) {
        const projectCode =
          await this.masterProjectsService.generateProjectCode();
        const masterRepo = this.dataSource.getRepository(MasterProject);
        const newMaster = masterRepo.create({
          name: dto.masterProjectName,
          projectCode,
          isActive: true,
          createdBy: userId,
        });
        masterProject = await masterRepo.save(newMaster);
      }
      masterProjectId = masterProject.id;
    }

    if (masterProjectId) {
      // Find or create the support project (for tracking, keeping backend consistency)
      await this.projectsService.findOrCreateSupportProject(
        (await this.masterProjectsService.findEntity(masterProjectId)).name,
        userId,
      );
    }

    const ticketCode = `TKT-${Date.now()}`;
    const ticket = this.ticketRepo.create({
      ...dto,
      createdAt: new Date(),
      createdBy: userId,
      masterProjectId,
      ticketCode,
    });
    const saved = await this.ticketRepo.save(ticket);

    // Reload with relations
    const fullTicket = await this.ticketRepo.findOne({
      where: { id: saved.id },
      relations: {
        masterProject: true,
        assignees: {
          user: true,
          role: true,
        },
      },
    });

    return {
      success: true,
      data: mapToDto(SupportTicketResponseDto, fullTicket),
    };
  }

  async findAll(
    query: PaginationDto,
  ): Promise<PaginatedResponseDto<SupportTicketResponseDto>> {
    const qb = this.ticketRepo
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.masterProject', 'masterProject')
      .leftJoinAndSelect('ticket.assignees', 'assignees')
      .leftJoinAndSelect('assignees.user', 'assigneeUser')
      .leftJoinAndSelect('assignees.role', 'assigneeRole');

    applyPagination(
      qb,
      query,
      ['ticketCode', 'issueTitle', 'status', 'masterProject.name'],
      {
        projectName: 'masterProject.name',
      },
    );

    const [tickets, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    return {
      success: true,
      data: mapToDtoArray(SupportTicketResponseDto, tickets),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(
    id: number,
  ): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: {
        masterProject: true,
        assignees: {
          user: true,
          role: true,
        },
      },
    });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return { success: true, data: mapToDto(SupportTicketResponseDto, ticket) };
  }

  async addAssignee(
    ticketId: number,
    dto: CreateSupportTicketAssigneeDto,
    userId?: number,
  ): Promise<BaseResponseDto<SupportTicketAssigneeResponseDto>> {
    const ticketRes = await this.findOne(ticketId);

    // Check if user is already assigned
    const existing = await this.assigneeRepo.findOne({
      where: { supportTicketId: ticketId, userId: dto.userId },
    });
    if (existing) {
      throw new Error(`User sudah diassign ke ticket ini`);
    }

    const assignee = this.assigneeRepo.create({
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      createdAt: new Date(),
      createdBy: userId,
      supportTicketId: ticketRes.data.id,
    });
    const saved = await this.assigneeRepo.save(assignee);

    const fullAssignee = await this.assigneeRepo.findOne({
      where: { id: saved.id },
      relations: { user: true, role: true },
    });

    return {
      success: true,
      data: mapToDto(SupportTicketAssigneeResponseDto, fullAssignee),
    };
  }

  async getAssignees(
    ticketId: number,
  ): Promise<BaseResponseDto<SupportTicketAssigneeResponseDto[]>> {
    const data = await this.assigneeRepo.find({
      where: { supportTicketId: ticketId },
      relations: { user: true, role: true },
    });
    return {
      success: true,
      data: mapToDtoArray(SupportTicketAssigneeResponseDto, data),
    };
  }

  async updateAssignee(
    ticketId: number,
    assigneeId: number,
    dto: UpdateSupportTicketAssigneeDto,
    userId?: number,
  ): Promise<BaseResponseDto<SupportTicketAssigneeResponseDto>> {
    const assignee = await this.assigneeRepo.findOne({
      where: { id: assigneeId, supportTicketId: ticketId },
    });
    if (!assignee)
      throw new NotFoundException(
        `Assignee ${assigneeId} not found for ticket ${ticketId}`,
      );

    const updateData: any = { ...dto };
    if (dto.startDate !== undefined) {
      updateData.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }
    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    this.assigneeRepo.merge(assignee, {
      ...updateData,
      updatedAt: new Date(),
      updatedBy: userId,
    });

    const saved = await this.assigneeRepo.save(assignee);
    const fullAssignee = await this.assigneeRepo.findOne({
      where: { id: saved.id },
      relations: { user: true, role: true },
    });

    return {
      success: true,
      data: mapToDto(SupportTicketAssigneeResponseDto, fullAssignee),
    };
  }

  async removeAssignee(
    ticketId: number,
    assigneeId: number,
  ): Promise<BaseResponseDto<SuccessResponseDto>> {
    const assignee = await this.assigneeRepo.findOne({
      where: { id: assigneeId, supportTicketId: ticketId },
    });
    if (!assignee)
      throw new NotFoundException(
        `Assignee ${assigneeId} not found for ticket ${ticketId}`,
      );

    await this.assigneeRepo.remove(assignee);
    return {
      success: true,
      data: { success: true },
      message: 'Assignee removed successfully',
    };
  }

  async update(
    id: number,
    dto: UpdateSupportTicketDto,
    userId?: number,
  ): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);

    let masterProjectId = dto.masterProjectId;

    // If masterProjectName provided but no masterProjectId, find or create
    if (masterProjectId === undefined && dto.masterProjectName) {
      let masterProject = await this.masterProjectsService.findByName(
        dto.masterProjectName,
      );
      if (!masterProject) {
        const projectCode =
          await this.masterProjectsService.generateProjectCode();
        const masterRepo = this.dataSource.getRepository(MasterProject);
        const newMaster = masterRepo.create({
          name: dto.masterProjectName,
          projectCode,
          isActive: true,
          createdBy: userId,
        });
        masterProject = await masterRepo.save(newMaster);
      }
      masterProjectId = masterProject.id;
    }

    const mergedMasterProjectId =
      masterProjectId !== undefined ? masterProjectId : ticket.masterProjectId;

    if (mergedMasterProjectId) {
      const masterProject = await this.masterProjectsService.findEntity(
        mergedMasterProjectId,
      );
      await this.projectsService.findOrCreateSupportProject(
        masterProject.name,
        userId,
      );
    }

    this.ticketRepo.merge(ticket, {
      ...dto,
      ...(masterProjectId !== undefined ? { masterProjectId } : {}),
      updatedAt: new Date(),
      updatedBy: userId,
    } as any);

    const updated = await this.ticketRepo.save(ticket);

    const fullTicket = await this.ticketRepo.findOne({
      where: { id: updated.id },
      relations: {
        masterProject: true,
        assignees: {
          user: true,
          role: true,
        },
      },
    });

    return {
      success: true,
      data: mapToDto(SupportTicketResponseDto, fullTicket),
    };
  }

  async remove(id: number): Promise<BaseResponseDto<SuccessResponseDto>> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);

    await this.dataSource.transaction(async (manager) => {
      // 1. Delete details first
      await manager.delete(SupportTicketAssignee, { supportTicketId: id });

      // 2. Delete the ticket itself
      await manager.delete(SupportTicket, { id });
    });

    return {
      success: true,
      data: { success: true },
      message: 'Ticket deleted successfully',
    };
  }
}
