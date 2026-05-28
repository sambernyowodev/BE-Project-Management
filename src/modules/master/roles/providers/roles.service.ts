import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { BaseResponseDto, SuccessResponseDto } from '../../../../common/dtos/response.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import { mapToDto, mapToDtoArray } from '../../../../common/utils/mapper.util';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) { }

  async create(createRoleDto: CreateRoleDto, userId: number): Promise<BaseResponseDto<RoleResponseDto>> {
    const role = this.roleRepo.create({
      ...createRoleDto,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.roleRepo.save(role);
    return { success: true, data: mapToDto(RoleResponseDto, saved) };
  }

  async findAll(): Promise<BaseResponseDto<RoleResponseDto[]>> {
    const data = await this.roleRepo.find();
    return { success: true, data: mapToDtoArray(RoleResponseDto, data) };
  }

  async findOne(id: number): Promise<BaseResponseDto<RoleResponseDto>> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return { success: true, data: mapToDto(RoleResponseDto, role) };
  }

  async update(id: number, dto: Partial<CreateRoleDto>, userId: number): Promise<BaseResponseDto<RoleResponseDto>> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    const updated = await this.roleRepo.update(id,
      {
        ...dto,
        updatedBy: userId,
        updatedAt: new Date()
      });
    return { success: true, data: mapToDto(RoleResponseDto, updated) };
  }

  async remove(id: number, userId: number): Promise<BaseResponseDto<SuccessResponseDto>> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    await this.roleRepo.softRemove(role);
    return { success: true, data: { success: true } };
  }
}
