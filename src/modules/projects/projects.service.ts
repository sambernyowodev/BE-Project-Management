import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { CreateProjectDto, AddProjectMemberDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
  ) {}

  async create(dto: CreateProjectDto, userId: number): Promise<Project> {
    const projectCode = await this.generateProjectCode();

    const project = this.projectRepo.create({
      ...dto,
      projectCode,
      createdById: userId,
    });

    return this.projectRepo.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async addMember(
    projectId: number,
    dto: AddProjectMemberDto,
  ): Promise<ProjectMember> {
    await this.findOne(projectId); // verify exists

    const member = this.memberRepo.create({
      projectId,
      ...dto,
    });
    return this.memberRepo.save(member);
  }

  async getMembers(projectId: number): Promise<ProjectMember[]> {
    return this.memberRepo.find({
      where: { projectId },
      relations: { user: true, role: true, secondaryRole: true },
    });
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
