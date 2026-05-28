import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { SupportTicketDetail } from './entities/support-ticket-detail.entity';
import {
  CreateSupportTicketDto,
  CreateSupportTicketDetailDto,
} from './dto/support-ticket.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';
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

  async findAll(): Promise<BaseResponseDto<SupportTicketResponseDto[]>> {
    const data = await this.ticketRepo.find({ order: { createdAt: 'DESC' } } as any);
    return { success: true, data: mapToDtoArray(SupportTicketResponseDto, data) };
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
}
