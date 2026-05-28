import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { CreateProjectDto, AddProjectMemberDto } from './dto/project.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';
import { ProjectResponseDto, ProjectMemberResponseDto } from './dto/project-response.dto';
import { mapToDto, mapToDtoArray } from '../../common/utils/mapper.util';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
  ) {}

  async create(dto: CreateProjectDto, userId: number): Promise<BaseResponseDto<ProjectResponseDto>> {
    const projectCode = await this.generateProjectCode();

    const project = this.projectRepo.create({
      ...dto,
      projectCode,
      createdById: userId,
    });

    const saved = await this.projectRepo.save(project);
    return { success: true, data: mapToDto(ProjectResponseDto, saved) };
  }

  async findAll(): Promise<BaseResponseDto<ProjectResponseDto[]>> {
    const data = await this.projectRepo.find({ order: { createdAt: 'DESC' } });
    return { success: true, data: mapToDtoArray(ProjectResponseDto, data) };
  }

  async findOne(id: number): Promise<BaseResponseDto<ProjectResponseDto>> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return { success: true, data: mapToDto(ProjectResponseDto, project) };
  }

  async addMember(
    projectId: number,
    dto: AddProjectMemberDto,
  ): Promise<BaseResponseDto<ProjectMemberResponseDto>> {
    await this.findOne(projectId); // verify exists

    const member = this.memberRepo.create({
      projectId,
      ...dto,
    });
    const saved = await this.memberRepo.save(member);
    return { success: true, data: mapToDto(ProjectMemberResponseDto, saved) };
  }

  async getMembers(projectId: number): Promise<BaseResponseDto<ProjectMemberResponseDto[]>> {
    const data = await this.memberRepo.find({
      where: { projectId },
      relations: { user: true, role: true, secondaryRole: true },
    });
    return { success: true, data: mapToDtoArray(ProjectMemberResponseDto, data) };
  }

  private async generateProjectCode(): Promise<string> {
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
