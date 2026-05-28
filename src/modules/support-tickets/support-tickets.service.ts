import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { SupportTicketDetail } from './entities/support-ticket-detail.entity';
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
  ) {}

  async create(dto: CreateSupportTicketDto): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    const ticketCode = `TKT-${Date.now()}`;
    const ticket = this.ticketRepo.create({
      ...dto,
      ticketCode,
    });
    const saved = await this.ticketRepo.save(ticket);
    return { success: true, data: mapToDto(SupportTicketResponseDto, saved) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<SupportTicketResponseDto>> {
    const qb = this.ticketRepo.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.project', 'project');
    
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
    const ticket = await this.ticketRepo.findOne({ where: { id } });
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

  async update(id: number, dto: UpdateSupportTicketDto): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    
    this.ticketRepo.merge(ticket, dto as any);
    const updated = await this.ticketRepo.save(ticket);
    return { success: true, data: mapToDto(SupportTicketResponseDto, updated) };
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
}
