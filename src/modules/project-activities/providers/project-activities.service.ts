import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectActivity } from '../entities/project-activity.entity';
import { CreateProjectActivityDto, UpdateProjectActivityDto, UpdateProgressDto } from '../dto/project-activity.dto';
import { BaseResponseDto, SuccessResponseDto } from '../../../common/dtos/response.dto';
import { ProjectActivityResponseDto } from '../dto/project-activity-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

@Injectable()
export class ProjectActivitiesService {
  constructor(
    @InjectRepository(ProjectActivity)
    private readonly activityRepo: Repository<ProjectActivity>,
  ) { }

  async create(dto: CreateProjectActivityDto, userId: number): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    const activity = this.activityRepo.create({
      ...dto,
      createdAt: new Date(),
      createdBy: userId,
    });
    const saved = await this.activityRepo.save(activity);
    // Reload with relations
    const full = await this.activityRepo.findOne({
      where: { id: saved.id },
      relations: { assignedTo: true },
    });
    return { success: true, data: mapToDto(ProjectActivityResponseDto, full) };
  }

  async findByProject(projectId: number): Promise<BaseResponseDto<ProjectActivityResponseDto[]>> {
    const data = await this.activityRepo.find({
      where: { projectId },
      relations: { assignedTo: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
    return { success: true, data: mapToDtoArray(ProjectActivityResponseDto, data) };
  }

  async findOne(id: number): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    const activity = await this.activityRepo.findOne({
      where: { id },
      relations: { assignedTo: true },
    });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);
    return { success: true, data: mapToDto(ProjectActivityResponseDto, activity) };
  }

  async update(id: number, dto: UpdateProjectActivityDto, userId: number): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    const activity = await this.activityRepo.findOne({
      where: { id },
      relations: { assignedTo: true },
    });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);

    this.activityRepo.merge(activity, dto, {
      updatedAt: new Date(),
      updatedBy: userId
    });
    const updated = await this.activityRepo.save(activity);

    // Reload to get fresh relations
    const full = await this.activityRepo.findOne({
      where: { id: updated.id },
      relations: { assignedTo: true },
    });
    return { success: true, data: mapToDto(ProjectActivityResponseDto, full) };
  }

  async updateProgress(id: number, dto: UpdateProgressDto, userId: number): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    const activity = await this.activityRepo.findOne({
      where: { id },
      relations: { assignedTo: true },
    });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);

    activity.progressPct = dto.progressPct;
    activity.updatedAt = new Date();
    activity.updatedBy = userId;
    const updated = await this.activityRepo.save(activity);
    return { success: true, data: mapToDto(ProjectActivityResponseDto, updated) };
  }

  async remove(id: number): Promise<BaseResponseDto<SuccessResponseDto>> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);

    await this.activityRepo.remove(activity);
    return { success: true, data: { success: true, message: 'Activity deleted successfully' } };
  }
}
