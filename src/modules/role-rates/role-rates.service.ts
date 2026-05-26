import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { RoleRate } from './entities/role-rate.entity';
import { CreateRoleRateDto } from './dto/create-role-rate.dto';

@Injectable()
export class RoleRatesService {
  constructor(
    @InjectRepository(RoleRate)
    private readonly roleRateRepo: Repository<RoleRate>,
  ) {}

  async create(dto: CreateRoleRateDto): Promise<RoleRate> {
    const rate = this.roleRateRepo.create({
      ...dto,
      effectiveFrom: new Date(dto.effectiveFrom),
      effectiveUntil: dto.effectiveUntil ? new Date(dto.effectiveUntil) : undefined,
    });
    return this.roleRateRepo.save(rate);
  }

  async findAll(): Promise<RoleRate[]> {
    return this.roleRateRepo.find({ relations: { role: true, project: true } });
  }

  async getGlobalRates(): Promise<RoleRate[]> {
    return this.roleRateRepo.find({
      where: { projectId: IsNull(), isActive: true },
      relations: { role: true },
      order: { effectiveFrom: 'DESC' }
    });
  }

  async getProjectRates(projectId: number): Promise<RoleRate[]> {
    return this.roleRateRepo.find({
      where: { projectId, isActive: true },
      relations: { role: true },
      order: { effectiveFrom: 'DESC' }
    });
  }
}
