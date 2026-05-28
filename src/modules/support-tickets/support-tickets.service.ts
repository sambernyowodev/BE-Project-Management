import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { SupportTicketDetail } from './entities/support-ticket-detail.entity';
import { ProjectsService } from '../projects/projects.service';
import {
  CreateSupportTicketDto,
  CreateSupportTicketDetailDto,
  UpdateSupportTicketDto,
} from './dto/support-ticket.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dtos/response.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { applyPagination } from '../../common/utils/query.util';
import { SupportTicketResponseDto } from './dto/support-ticket-response.dto';
import { SupportTicketDetailResponseDto } from './dto/support-ticket-detail-response.dto';
import { mapToDto, mapToDtoArray } from '../../common/utils/mapper.util';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepo: Repository<SupportTicket>,
    @InjectRepository(SupportTicketDetail)
    private readonly detailRepo: Repository<SupportTicketDetail>,
    private readonly dataSource: DataSource,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(dto: CreateSupportTicketDto, userId?: number): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    let projectId = dto.projectId;
    let projectName = dto.projectName;

    if (!projectId && projectName) {
      const project = await this.projectsService.findOrCreateSupportProject(projectName, userId);
      projectId = project.id;
      projectName = project.name;
    } else if (projectId) {
      const projectRes = await this.projectsService.findOne(projectId);
      if (projectRes && projectRes.data) {
        projectName = projectRes.data.name;
      }
    }

    if (projectId) {
      await this.processTicketAssignments(projectId, dto);
    }

    const ticketCode = `TKT-${Date.now()}`;
    const ticket = this.ticketRepo.create({
      ...dto,
      projectId,
      projectName,
      ticketCode,
    });
    const saved = await this.ticketRepo.save(ticket);

    // Reload with relations
    const fullTicket = await this.ticketRepo.findOne({
      where: { id: saved.id },
      relations: {
        project: true,
        businessAnalyst: true,
        uiUx: true,
        devFe: true,
        devBe: true,
      },
    });

    return { success: true, data: mapToDto(SupportTicketResponseDto, fullTicket) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<SupportTicketResponseDto>> {
    const qb = this.ticketRepo.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.project', 'project')
      .leftJoinAndSelect('ticket.businessAnalyst', 'businessAnalyst')
      .leftJoinAndSelect('ticket.uiUx', 'uiUx')
      .leftJoinAndSelect('ticket.devFe', 'devFe')
      .leftJoinAndSelect('ticket.devBe', 'devBe');
    
    applyPagination(qb, query, ['ticketCode', 'issueTitle', 'status', 'projectName']);
    
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

  async findOne(id: number): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: {
        project: true,
        businessAnalyst: true,
        uiUx: true,
        devFe: true,
        devBe: true,
      },
    });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return { success: true, data: mapToDto(SupportTicketResponseDto, ticket) };
  }

  async addDetail(
    ticketId: number,
    dto: CreateSupportTicketDetailDto,
  ): Promise<BaseResponseDto<SupportTicketDetailResponseDto>> {
    const ticketRes = await this.findOne(ticketId);

    const detail = this.detailRepo.create({
      ...dto,
      supportTicketId: ticketRes.data.id,
    });
    const saved = await this.detailRepo.save(detail);
    return { success: true, data: mapToDto(SupportTicketDetailResponseDto, saved) };
  }

  async getDetails(ticketId: number): Promise<BaseResponseDto<SupportTicketDetailResponseDto[]>> {
    const data = await this.detailRepo.find({ where: { supportTicketId: ticketId } });
    return { success: true, data: mapToDtoArray(SupportTicketDetailResponseDto, data) };
  }

  async update(id: number, dto: UpdateSupportTicketDto, userId?: number): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    
    let projectId = dto.projectId;
    let projectName = dto.projectName;

    if (projectId === undefined && projectName) {
      const project = await this.projectsService.findOrCreateSupportProject(projectName, userId);
      projectId = project.id;
      projectName = project.name;
    } else if (projectId) {
      const projectRes = await this.projectsService.findOne(projectId);
      if (projectRes && projectRes.data) {
        projectName = projectRes.data.name;
      }
    }

    const mergedProjectId = projectId !== undefined ? projectId : ticket.projectId;

    if (mergedProjectId) {
      await this.processTicketAssignments(mergedProjectId, {
        businessAnalystId: dto.businessAnalystId !== undefined ? dto.businessAnalystId : ticket.businessAnalystId,
        uiUxId: dto.uiUxId !== undefined ? dto.uiUxId : ticket.uiUxId,
        devFeId: dto.devFeId !== undefined ? dto.devFeId : ticket.devFeId,
        devBeId: dto.devBeId !== undefined ? dto.devBeId : ticket.devBeId,
      });
    }

    this.ticketRepo.merge(ticket, {
      ...dto,
      ...(projectId !== undefined ? { projectId } : {}),
      ...(projectName !== undefined ? { projectName } : {}),
    } as any);

    const updated = await this.ticketRepo.save(ticket);

    const fullTicket = await this.ticketRepo.findOne({
      where: { id: updated.id },
      relations: {
        project: true,
        businessAnalyst: true,
        uiUx: true,
        devFe: true,
        devBe: true,
      },
    });

    return { success: true, data: mapToDto(SupportTicketResponseDto, fullTicket) };
  }

  async remove(id: number): Promise<BaseResponseDto<null>> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    
    await this.dataSource.transaction(async (manager) => {
      // 1. Delete details first
      await manager.delete(SupportTicketDetail, { supportTicketId: id });
      
      // 2. Delete the ticket itself
      await manager.delete(SupportTicket, { id });
    });

    return { success: true, data: null, message: 'Ticket deleted successfully' };
  }

  private async processTicketAssignments(
    projectId: number,
    dto: {
      businessAnalystId?: number;
      uiUxId?: number;
      devFeId?: number;
      devBeId?: number;
    },
  ) {
    if (!projectId) return;

    if (dto.businessAnalystId) {
      await this.projectsService.ensureProjectMember(projectId, dto.businessAnalystId, 'BA');
    }
    if (dto.uiUxId) {
      await this.projectsService.ensureProjectMember(projectId, dto.uiUxId, 'UIUX');
    }
    if (dto.devFeId) {
      await this.projectsService.ensureProjectMember(projectId, dto.devFeId, 'DEV_FE');
    }
    if (dto.devBeId) {
      await this.projectsService.ensureProjectMember(projectId, dto.devBeId, 'DEV_BE');
    }
  }
}
