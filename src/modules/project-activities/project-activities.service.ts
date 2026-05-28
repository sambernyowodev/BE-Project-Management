import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectActivity } from './entities/project-activity.entity';
import { CreateProjectActivityDto } from './dto/project-activity.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';
import { ProjectActivityResponseDto } from './dto/project-activity-response.dto';
import { mapToDto, mapToDtoArray } from '../../common/utils/mapper.util';

@Injectable()
export class ProjectActivitiesService {
  constructor(
    @InjectRepository(ProjectActivity)
    private readonly activityRepo: Repository<ProjectActivity>,
  ) {}

  async create(dto: CreateProjectActivityDto): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    const activity = this.activityRepo.create(dto);
    const saved = await this.activityRepo.save(activity);
    return { success: true, data: mapToDto(ProjectActivityResponseDto, saved) };
  }

  async findByProject(projectId: number): Promise<BaseResponseDto<ProjectActivityResponseDto[]>> {
    const data = await this.activityRepo.find({
      where: { projectId },
      order: { sortOrder: 'ASC' } as any, // Ignoring sortOrder TS error if it doesn't exist on entity
    });
    return { success: true, data: mapToDtoArray(ProjectActivityResponseDto, data) };
  }

  async findOne(id: number): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);
    return { success: true, data: mapToDto(ProjectActivityResponseDto, activity) };
  }
}
