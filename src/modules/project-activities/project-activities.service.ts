import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectActivity } from './entities/project-activity.entity';
import { CreateProjectActivityDto } from './dto/project-activity.dto';

@Injectable()
export class ProjectActivitiesService {
  constructor(
    @InjectRepository(ProjectActivity)
    private readonly activityRepo: Repository<ProjectActivity>,
  ) {}

  async create(dto: CreateProjectActivityDto): Promise<ProjectActivity> {
    const activity = this.activityRepo.create(dto);
    return this.activityRepo.save(activity);
  }

  async findByProject(projectId: number): Promise<ProjectActivity[]> {
    return this.activityRepo.find({
      where: { projectId },
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProjectActivity> {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);
    return activity;
  }
}
