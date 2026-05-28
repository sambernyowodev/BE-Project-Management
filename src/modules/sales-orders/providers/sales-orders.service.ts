import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SalesOrder } from '../entities/sales-order.entity';
import { CreateSalesOrderDto } from '../dto/sales-order.dto';
import { PurchaseOrdersService } from '../../purchase-orders/providers/purchase-orders.service';
import { SalesOrderStatus } from '../../../common/enums';
import { BaseResponseDto, PaginatedResponseDto } from '../../../common/dtos/response.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../common/utils/query.util';
import { SalesOrderResponseDto } from '../dto/sales-order-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

@Injectable()
export class SalesOrdersService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly soRepo: Repository<SalesOrder>,
    private readonly poService: PurchaseOrdersService,
  ) { }

  async create(dto: CreateSalesOrderDto, userId: number): Promise<BaseResponseDto<SalesOrderResponseDto>> {
    const poRes = await this.poService.findOne(dto.poId);
    if (!poRes || !poRes.data) throw new NotFoundException('Purchase Order not found');

    const po = poRes.data;
    const soNumber = await this.generateSoNumber(po.poNumber);

    const so = this.soRepo.create({
      ...dto,
      soNumber,
    });
    const saved = await this.soRepo.save(so);
    return { success: true, data: mapToDto(SalesOrderResponseDto, saved) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<SalesOrderResponseDto>> {
    const qb = this.soRepo.createQueryBuilder('so')
      .leftJoinAndSelect('so.po', 'po')
      .leftJoinAndSelect('so.project', 'project');

    applyPagination(qb, query, ['soNumber', 'soName', 'status']);

    const [sos, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    return {
      success: true,
      data: mapToDtoArray(SalesOrderResponseDto, sos),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number): Promise<BaseResponseDto<SalesOrderResponseDto>> {
    const so = await this.soRepo.findOne({
      where: { id },
      relations: { po: true, project: true },
    });
    if (!so) throw new NotFoundException(`SO ${id} not found`);
    return { success: true, data: mapToDto(SalesOrderResponseDto, so) };
  }

  async updateStatus(id: number, status: SalesOrderStatus, userId: number): Promise<BaseResponseDto<SalesOrderResponseDto>> {
    const soRes = await this.findOne(id);
    const so = await this.soRepo.findOne({ where: { id: soRes.data.id } }); // Fetch entity to save
    if (!so) throw new NotFoundException();
    so.updatedAt = new Date();
    so.updatedBy = userId;
    so.status = status;
    const saved = await this.soRepo.save(so);
    return { success: true, data: mapToDto(SalesOrderResponseDto, saved) };
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
