import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SalesOrder } from './entities/sales-order.entity';
import { CreateSalesOrderDto } from './dto/sales-order.dto';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';

@Injectable()
export class SalesOrdersService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly soRepo: Repository<SalesOrder>,
    private readonly poService: PurchaseOrdersService,
  ) {}

  async create(dto: CreateSalesOrderDto): Promise<SalesOrder> {
    const po = await this.poService.findOne(dto.poId);
    if (!po) throw new NotFoundException('Purchase Order not found');

    const soNumber = await this.generateSoNumber(po.poNumber);

    const so = this.soRepo.create({
      ...dto,
      soNumber,
    });
    return this.soRepo.save(so);
  }

  async findAll(): Promise<SalesOrder[]> {
    return this.soRepo.find({ relations: { po: true, project: true } });
  }

  async findOne(id: number): Promise<SalesOrder> {
    const so = await this.soRepo.findOne({
      where: { id },
      relations: { po: true, project: true },
    });
    if (!so) throw new NotFoundException(`SO ${id} not found`);
    return so;
  }

  async updateStatus(id: number, status: string): Promise<SalesOrder> {
    const so = await this.findOne(id);
    so.status = status;
    return this.soRepo.save(so);
  }

  private async generateSoNumber(poNumber: string): Promise<string> {
    // poNumber example: PO-HCM-2026-001
    // SO prefix: SO-HCM-2026-001-
    const prefix = poNumber.replace('PO-', 'SO-') + '-';

    const lastSo = await this.soRepo.findOne({
      where: { soNumber: Like(`${prefix}%`) },
      order: { soNumber: 'DESC' },
    });

    let nextChar = 'A';
    if (lastSo && lastSo.soNumber) {
      const parts = lastSo.soNumber.split('-');
      const lastChar = parts[parts.length - 1]; // e.g., 'A'
      if (lastChar && lastChar.length === 1) {
        nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
      }
    }

    return `${prefix}${nextChar}`;
  }
}
