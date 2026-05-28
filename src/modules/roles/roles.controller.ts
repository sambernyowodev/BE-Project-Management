import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../common/decorators/api-response.decorator';
import { RoleResponseDto } from './dto/role-response.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBaseResponse(RoleResponseDto)
  create(@Body() createRoleDto: CreateRoleDto): Promise<BaseResponseDto<RoleResponseDto>> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiBaseListResponse(RoleResponseDto)
  findAll(): Promise<BaseResponseDto<RoleResponseDto[]>> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiBaseResponse(RoleResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<RoleResponseDto>> {
    return this.rolesService.findOne(+id);
  }
}
