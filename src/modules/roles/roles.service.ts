import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { mapToDto, mapToDtoArray } from '../../common/utils/mapper.util';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<BaseResponseDto<RoleResponseDto>> {
    const role = this.roleRepo.create(createRoleDto);
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
}
