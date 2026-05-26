import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { SupportTicketDetail } from './entities/support-ticket-detail.entity';
import {
  CreateSupportTicketDto,
  CreateSupportTicketDetailDto,
} from './dto/support-ticket.dto';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepo: Repository<SupportTicket>,
    @InjectRepository(SupportTicketDetail)
    private readonly detailRepo: Repository<SupportTicketDetail>,
  ) {}

  async create(dto: CreateSupportTicketDto): Promise<SupportTicket> {
    const ticketCode = `TKT-${Date.now()}`;
    const ticket = this.ticketRepo.create({
      ...dto,
      ticketCode,
    });
    return this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<SupportTicket[]> {
    return this.ticketRepo.find({ order: { createdAt: 'DESC' } } as any);
  }

  async findOne(id: number): Promise<SupportTicket> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return ticket;
  }

  async addDetail(
    ticketId: number,
    dto: CreateSupportTicketDetailDto,
  ): Promise<SupportTicketDetail> {
    const ticket = await this.findOne(ticketId);

    const detail = this.detailRepo.create({
      ...dto,
      supportTicketId: ticket.id,
    });
    return this.detailRepo.save(detail);
  }

  async getDetails(ticketId: number): Promise<SupportTicketDetail[]> {
    return this.detailRepo.find({ where: { supportTicketId: ticketId } });
  }
}
