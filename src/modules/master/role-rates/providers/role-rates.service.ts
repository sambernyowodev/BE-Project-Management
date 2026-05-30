import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      createdAt: new Date(),
      createdBy: userId
    });
    const saved = await this.roleRateRepo.save(rate);
    return { success: true, data: mapToDto(RoleRateResponseDto, saved) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<RoleRateResponseDto>> {
    const qb = this.roleRateRepo.createQueryBuilder('roleRate')
      .leftJoinAndSelect('roleRate.role', 'role');

    applyPagination(qb, query, ['role.name'], {});

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
      where: { isActive: true },
      relations: { role: true },
    });
    return { success: true, data: mapToDtoArray(RoleRateResponseDto, data) };
  }

  async update(id: number, dto: Partial<CreateRoleRateDto>, userId: number): Promise<BaseResponseDto<RoleRateResponseDto>> {
    const rate = await this.roleRateRepo.findOne({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Role rate with id ${id} not found`);
    }
    rate.roleId = dto.roleId ?? rate.roleId;
    rate.ratePerMandayProject = dto.ratePerMandayProject ?? rate.ratePerMandayProject;
    rate.ratePerMandaySupport = dto.ratePerMandaySupport ?? rate.ratePerMandaySupport;
    rate.currency = dto.currency ?? rate.currency;
    rate.updatedAt = new Date();
    rate.updatedBy = userId;
    const saved = await this.roleRateRepo.save(rate);
    return { success: true, data: mapToDto(RoleRateResponseDto, saved) };
  }

  async findOne(id: number): Promise<BaseResponseDto<RoleRateResponseDto>> {
    const rate = await this.roleRateRepo.findOne({
      where: { id },
      relations: { role: true }
    });
    if (!rate) {
      throw new NotFoundException(`Role rate with id ${id} not found`);
    }
    return { success: true, data: mapToDto(RoleRateResponseDto, rate) };
  }

  async remove(id: number, userId: number): Promise<BaseResponseDto<any>> {
    const rate = await this.roleRateRepo.findOne({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Role rate with id ${id} not found`);
    }
    rate.updatedBy = userId;
    await this.roleRateRepo.save(rate);
    await this.roleRateRepo.softDelete(id);
    return { success: true, data: null, message: 'Role rate soft deleted successfully' };
  }
}

