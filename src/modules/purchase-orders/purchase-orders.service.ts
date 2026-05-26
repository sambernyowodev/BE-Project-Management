import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
  ) {}

  async create(
    dto: CreatePurchaseOrderDto,
    userId: number,
  ): Promise<PurchaseOrder> {
    const poNumber = await this.generatePoNumber();
    const po = this.poRepo.create({
      ...dto,
      poNumber,
      createdById: userId,
    });
    return this.poRepo.save(po);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.poRepo.find({ relations: { project: true } });
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!po) throw new NotFoundException(`PO ${id} not found`);
    return po;
  }

  async findByProject(projectId: number): Promise<PurchaseOrder[]> {
    return this.poRepo.find({ where: { projectId } });
  }

  private async generatePoNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PO-HCM-${year}-`;

    const lastPo = await this.poRepo.findOne({
      where: { poNumber: Like(`${prefix}%`) },
      order: { poNumber: 'DESC' },
    });

    let nextNumber = 1;
    if (lastPo && lastPo.poNumber) {
      const parts = lastPo.poNumber.split('-');
      const sequence = parseInt(parts[3], 10);
      if (!isNaN(sequence)) {
        nextNumber = sequence + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }
}
