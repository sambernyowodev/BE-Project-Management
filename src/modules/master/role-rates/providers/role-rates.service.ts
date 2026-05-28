import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { RoleRate } from '../entities/role-rate.entity';
import { CreateRoleRateDto } from '../dto/create-role-rate.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../../common/dtos/response.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../../common/utils/query.util';
import { RoleRateResponseDto } from '../dto/role-rate-response.dto';
import { mapToDto, mapToDtoArray } from '../../../../common/utils/mapper.util';

@Injectable()
export class RoleRatesService {
  constructor(
    @InjectRepository(RoleRate)
    private readonly roleRateRepo: Repository<RoleRate>,
  ) { }

  async create(dto: CreateRoleRateDto, userId: number): Promise<BaseResponseDto<RoleRateResponseDto>> {
    const rate = this.roleRateRepo.create({
      ...dto,
      effectiveFrom: new Date(dto.effectiveFrom),
      effectiveUntil: dto.effectiveUntil ? new Date(dto.effectiveUntil) : undefined,
      createdAt: new Date(),
      createdBy: userId
    });
    const saved = await this.roleRateRepo.save(rate);
    return { success: true, data: mapToDto(RoleRateResponseDto, saved) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<RoleRateResponseDto>> {
    const qb = this.roleRateRepo.createQueryBuilder('roleRate')
      .leftJoinAndSelect('roleRate.role', 'role')
      .leftJoinAndSelect('roleRate.project', 'project');

    applyPagination(qb, query, ['role.name', 'project.name']);

    const [rates, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    return {
      success: true,
      data: mapToDtoArray(RoleRateResponseDto, rates),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async getGlobalRates(): Promise<BaseResponseDto<RoleRateResponseDto[]>> {
    const data = await this.roleRateRepo.find({
      where: { projectId: IsNull(), isActive: true },
      relations: { role: true },
      order: { effectiveFrom: 'DESC' }
    });
    return { success: true, data: mapToDtoArray(RoleRateResponseDto, data) };
  }

  async getProjectRates(projectId: number): Promise<BaseResponseDto<RoleRateResponseDto[]>> {
    const data = await this.roleRateRepo.find({
      where: { projectId, isActive: true },
      relations: { role: true },
      order: { effectiveFrom: 'DESC' }
    });
    return { success: true, data: mapToDtoArray(RoleRateResponseDto, data) };
  }

  async update(id: number, dto: Partial<CreateRoleRateDto>, userId: number): Promise<BaseResponseDto<RoleRateResponseDto>> {
    const rate = await this.roleRateRepo.findOne({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Role rate with id ${id} not found`);
    }
    rate.projectId = dto.projectId || rate.projectId;
    rate.roleId = dto.roleId || rate.roleId;
    rate.effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : rate.effectiveFrom;
    rate.effectiveUntil = dto.effectiveUntil ? new Date(dto.effectiveUntil) : rate.effectiveUntil;
    rate.isActive = rate.isActive;
    rate.updatedAt = new Date();
    rate.updatedBy = userId;
    const saved = await this.roleRateRepo.save(rate);
    return { success: true, data: mapToDto(RoleRateResponseDto, saved) };
  }
}
