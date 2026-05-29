import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PoProject } from '../entities/po-project.entity';
import { Project } from '../../projects/entities/project.entity';
import { ProjectMember } from '../../projects/entities/project-member.entity';
import { PoMember } from '../../po-members/entities/po-member.entity';
import { CreatePurchaseOrderDto } from '../dto/purchase-order.dto';
import { AddPoProjectDto } from '../dto/po-project.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../common/dtos/response.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../common/utils/query.util';
import { PurchaseOrderResponseDto } from '../dto/purchase-order-response.dto';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { mapToDto, mapToDtoArray } from '../../../common/utils/mapper.util';

function computePoFields(po: PurchaseOrder) {
  const poProjects = po.poProjects || [];
  const allocatedMandays = poProjects.reduce((sum, p) => sum + Number(p.allocatedMandays || 0), 0);
  const remainingMandays = Number(po.totalMandays || 0) - allocatedMandays;
  const projectCount = poProjects.length;

  return {
    ...po,
    allocatedMandays,
    remainingMandays,
    projectCount,
  };
}

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PoProject)
    private readonly poProjectRepo: Repository<PoProject>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) { }

  async create(
    dto: CreatePurchaseOrderDto,
    userId: number,
  ): Promise<BaseResponseDto<PurchaseOrderResponseDto>> {
    const poNumber = await this.generatePoNumber();
    const po = this.poRepo.create({
      ...dto,
      poNumber,
      createdBy: userId,
      createdAt: new Date(),
    });
    const saved = await this.poRepo.save(po);
    const computed = computePoFields(saved);
    return { success: true, data: mapToDto(PurchaseOrderResponseDto, computed) };
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<PurchaseOrderResponseDto>> {
    const qb = this.poRepo.createQueryBuilder('po')
      .leftJoinAndSelect('po.poProjects', 'poProject')
      .leftJoinAndSelect('poProject.project', 'project')
      .leftJoinAndSelect('project.project', 'masterProject');

    applyPagination(qb, query, ['poNumber', 'poName', 'customer', 'status'], {
      'project.name': 'masterProject.name',
      'allocatedMandays': `(
        SELECT COALESCE(SUM(pp.allocated_mandays), 0)
        FROM po_projects pp
        WHERE pp.po_id = po.id AND pp.deleted_at IS NULL
      )`,
      'remainingMandays': `(
        po.total_mandays - COALESCE((
          SELECT SUM(pp.allocated_mandays)
          FROM po_projects pp
          WHERE pp.po_id = po.id AND pp.deleted_at IS NULL
        ), 0)
      )`
    });

    const [pos, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    const mapped = pos.map(po => {
      const computed = computePoFields(po);
      return mapToDto(PurchaseOrderResponseDto, computed);
    });

    return {
      success: true,
      data: mapped,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number): Promise<BaseResponseDto<PurchaseOrderResponseDto>> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: {
        poProjects: {
          project: {
            project: true,
          },
        },
      },
    });
    if (!po) throw new NotFoundException(`PO ${id} not found`);
    const computed = computePoFields(po);
    return { success: true, data: mapToDto(PurchaseOrderResponseDto, computed) };
  }

  async findByProject(projectId: number): Promise<BaseResponseDto<PurchaseOrderResponseDto[]>> {
    const pos = await this.poRepo.createQueryBuilder('po')
      .leftJoinAndSelect('po.poProjects', 'poProject')
      .leftJoinAndSelect('poProject.project', 'project')
      .leftJoinAndSelect('project.project', 'masterProject')
      .where('poProject.projectId = :projectId', { projectId })
      .getMany();

    const mapped = pos.map(po => {
      const computed = computePoFields(po);
      return mapToDto(PurchaseOrderResponseDto, computed);
    });

    return { success: true, data: mapped };
  }

  async addProject(
    poId: number,
    dto: AddPoProjectDto,
    userId: number,
  ): Promise<BaseResponseDto<any>> {
    const po = await this.poRepo.findOne({ where: { id: poId } });
    if (!po) throw new NotFoundException(`PO ${poId} not found`);

    const project = await this.projectRepo.findOne({ where: { id: dto.projectId } });
    if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);

    await this.poRepo.manager.transaction(async (manager) => {
      let poProject = await manager.findOne(PoProject, {
        where: { poId, projectId: dto.projectId },
      });

      if (poProject) {
        poProject.allocatedMandays = dto.allocatedMandays;
        poProject.remarks = dto.remarks;
        poProject.updatedAt = new Date();
        poProject.updatedBy = userId;
      } else {
        poProject = manager.create(PoProject, {
          poId,
          projectId: dto.projectId,
          allocatedMandays: dto.allocatedMandays,
          remarks: dto.remarks,
          createdBy: userId,
          createdAt: new Date(),
        });
      }
      await manager.save(poProject);

      // Find all ProjectMembers for this project
      const projectMembers = await manager.find(ProjectMember, {
        where: { projectId: dto.projectId },
      });

      // Create PoMember for each project member if it doesn't exist
      for (const pm of projectMembers) {
        let poMember = await manager.findOne(PoMember, {
          where: { poId, projectMemberId: pm.id, roleId: pm.roleId },
        });
        if (!poMember) {
          poMember = manager.create(PoMember, {
            poId,
            projectMemberId: pm.id,
            roleId: pm.roleId,
            actualMandays: pm.actualMandays || 0,
            actualHours: 0,
            ratePerManday: 0,
            totalCost: 0,
            isBillable: true,
            createdBy: userId,
            createdAt: new Date(),
          });
          await manager.save(poMember);
        }
      }
    });

    return { success: true, data: null };
  }

  async removeProject(poId: number, projectId: number): Promise<BaseResponseDto<any>> {
    const poProject = await this.poProjectRepo.findOne({
      where: { poId, projectId },
    });
    if (!poProject) {
      throw new NotFoundException(`Project ${projectId} is not assigned to PO ${poId}`);
    }

    await this.poRepo.manager.transaction(async (manager) => {
      // Delete the po_projects junction row
      await manager.remove(poProject);

      // Find all ProjectMembers for this project
      const projectMembers = await manager.find(ProjectMember, {
        where: { projectId },
      });
      const pmIds = projectMembers.map(pm => pm.id);

      // Delete PoMembers of this project from this PO
      if (pmIds.length > 0) {
        await manager.createQueryBuilder()
          .delete()
          .from(PoMember)
          .where('poId = :poId AND projectMemberId IN (:...pmIds)', { poId, pmIds })
          .execute();
      }
    });

    return { success: true, data: null };
  }

  async getProjectsWithoutPo(): Promise<BaseResponseDto<ProjectResponseDto[]>> {
    const projects = await this.projectRepo.createQueryBuilder('project')
      .leftJoinAndSelect('project.project', 'masterProject')
      .leftJoin('po_projects', 'pp', 'pp.project_id = project.id AND pp.deleted_at IS NULL')
      .where('pp.id IS NULL')
      .andWhere('project.isActive = :isActive', { isActive: true })
      .getMany();

    return { success: true, data: mapToDtoArray(ProjectResponseDto, projects) };
  }

  private async generatePoNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PO-HCM-${year}-`;

    const lastPo = await this.poRepo.findOne({
      where: { poNumber: Like(`${prefix}%`) },
      order: { poNumber: 'DESC' },
    });

    let nextNumber = 1;
    if (lastPo && lastPo.poNumber) {
      const parts = lastPo.poNumber.split('-');
      const sequence = parseInt(parts[3], 10);
      if (!isNaN(sequence)) {
        nextNumber = sequence + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }

  async update(
    id: number,
    dto: Partial<CreatePurchaseOrderDto>,
    userId: number,
  ): Promise<BaseResponseDto<PurchaseOrderResponseDto>> {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) throw new NotFoundException(`PO ${id} not found`);

    Object.assign(po, dto);
    po.updatedBy = userId;
    po.updatedAt = new Date();

    const saved = await this.poRepo.save(po);
    const computed = computePoFields(saved);
    return { success: true, data: mapToDto(PurchaseOrderResponseDto, computed) };
  }

  async remove(id: number): Promise<BaseResponseDto<void>> {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) throw new NotFoundException(`PO ${id} not found`);

    await this.poRepo.remove(po);
    return { success: true, data: undefined };
  }
}
