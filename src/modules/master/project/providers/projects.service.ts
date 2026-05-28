import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { MasterProject } from '../entities/project.entity';
import { CreateMasterProjectDto } from '../dto/project.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../../common/dtos/response.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../../common/utils/query.util';
import { MasterProjectResponseDto } from '../dto/project-response.dto';
import { mapToDto, mapToDtoArray } from '../../../../common/utils/mapper.util';
import { SuccessResponseDto } from '../../../../common/dtos/response.dto';

@Injectable()
export class MasterProjectsService {
  constructor(
    @InjectRepository(MasterProject)
    private readonly projectRepo: Repository<MasterProject>,
  ) { }

  async create(dto: CreateMasterProjectDto, userId: number): Promise<BaseResponseDto<MasterProjectResponseDto>> {
    const projectCode = await this.generateProjectCode();

    const project = this.projectRepo.create({
      ...dto,
      projectCode,
      createdBy: userId,
    });

    const saved = await this.projectRepo.save(project);
    return { success: true, data: mapToDto(MasterProjectResponseDto, saved) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<MasterProjectResponseDto>> {
    const qb = this.projectRepo.createQueryBuilder('project');

    applyPagination(qb, query, ['projectCode', 'name', 'platform']);

    const [projects, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    return {
      success: true,
      data: mapToDtoArray(MasterProjectResponseDto, projects),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number): Promise<BaseResponseDto<MasterProjectResponseDto>> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Master Project ${id} not found`);
    return { success: true, data: mapToDto(MasterProjectResponseDto, project) };
  }

  async findEntity(id: number): Promise<MasterProject> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Master Project ${id} not found`);
    return project;
  }

  async findByName(name: string): Promise<MasterProject | null> {
    return this.projectRepo.findOne({ where: { name } });
  }

  async update(id: number, dto: Partial<CreateMasterProjectDto>, userId: number): Promise<BaseResponseDto<MasterProjectResponseDto>> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Master Project ${id} not found`);

    // Merge updates
    this.projectRepo.merge(project, dto, { updatedBy: userId });
    const updated = await this.projectRepo.save(project);

    return { success: true, data: mapToDto(MasterProjectResponseDto, updated) };
  }

  async remove(id: number): Promise<BaseResponseDto<SuccessResponseDto>> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Master Project ${id} not found`);
    await this.projectRepo.softRemove(project);
    return { success: true, data: { success: true } };
  }

  async generateProjectCode(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `HCM-${year}-`;

    const lastProject = await this.projectRepo.findOne({
      where: { projectCode: Like(`${prefix}%`) },
      order: { projectCode: 'DESC' },
    });

    let nextNumber = 1;
    if (lastProject && lastProject.projectCode) {
      const parts = lastProject.projectCode.split('-');
      const sequence = parseInt(parts[2], 10);
      if (!isNaN(sequence)) {
        nextNumber = sequence + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }
}
