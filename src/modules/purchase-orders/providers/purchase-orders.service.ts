import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { CreatePurchaseOrderDto } from '../dto/purchase-order.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../common/dtos/response.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../common/utils/query.util';
import { PurchaseOrderResponseDto } from '../dto/purchase-order-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
  ) { }

  async create(
    dto: CreatePurchaseOrderDto,
    userId: number,
  ): Promise<BaseResponseDto<PurchaseOrderResponseDto>> {
    const poNumber = await this.generatePoNumber();
    const po = this.poRepo.create({
      ...dto,
      poNumber,
      createdBy: userId,
      createdAt: new Date(),
    });
    const saved = await this.poRepo.save(po);
    return { success: true, data: mapToDto(PurchaseOrderResponseDto, saved) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<PurchaseOrderResponseDto>> {
    const qb = this.poRepo.createQueryBuilder('po')
      .leftJoinAndSelect('po.project', 'project');

    applyPagination(qb, query, ['poNumber', 'poName', 'customer', 'status']);

    const [pos, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    return {
      success: true,
      data: mapToDtoArray(PurchaseOrderResponseDto, pos),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number): Promise<BaseResponseDto<PurchaseOrderResponseDto>> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!po) throw new NotFoundException(`PO ${id} not found`);
    return { success: true, data: mapToDto(PurchaseOrderResponseDto, po) };
  }

  async findByProject(projectId: number): Promise<BaseResponseDto<PurchaseOrderResponseDto[]>> {
    const data = await this.poRepo.find({ where: { projectId } });
    return { success: true, data: mapToDtoArray(PurchaseOrderResponseDto, data) };
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
