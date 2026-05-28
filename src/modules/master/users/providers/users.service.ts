import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../../common/dtos/response.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { applyPagination } from '../../../../common/utils/query.util';
import { UserResponseDto } from '../dto/user-response.dto';
import { mapToDto, mapToDtoArray } from '../../../../common/utils/mapper.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const qb = this.userRepository.createQueryBuilder('user');

    applyPagination(qb, query, ['fullName', 'email', 'employeeId']);

    const [users, total] = await qb.getManyAndCount();
    const perPage = query.perPage || 10;
    const page = query.page || 1;

    return {
      success: true,
      data: mapToDtoArray(UserResponseDto, users),
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return { success: true, data: mapToDto(UserResponseDto, user) };
  }

  async createUser(dto: CreateUserDto, creatorId?: number): Promise<BaseResponseDto<UserResponseDto>> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      employeeId: dto.employeeId,
      avatarUrl: dto.avatarUrl,
      isActive: true,
      createdBy: creatorId,
    });

    const saved = await this.userRepository.save(user);
    return { success: true, data: mapToDto(UserResponseDto, saved) };
  }

  async update(id: number, dto: UpdateUserDto, userId: number): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    this.userRepository.merge(user, dto, { updatedAt: new Date(), updatedBy: userId });
    const updated = await this.userRepository.save(user);

    return { success: true, data: mapToDto(UserResponseDto, updated) };
  }

  async remove(id: number, userId: number): Promise<BaseResponseDto<null>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    user.isActive = false;
    user.updatedAt = new Date();
    user.updatedBy = userId;
    await this.userRepository.save(user);

    return { success: true, data: null, message: 'User deactivated successfully' };
  }
}
