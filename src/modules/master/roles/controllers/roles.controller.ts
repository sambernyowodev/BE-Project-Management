import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from '../providers/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../../common/decorators/api-response.decorator';
import { RoleResponseDto } from '../dto/role-response.dto';
import { BaseResponseDto, SuccessResponseDto } from '../../../../common/dtos/response.dto';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBaseResponse(RoleResponseDto)
  create(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<RoleResponseDto>> {
    return this.rolesService.create(createRoleDto, user.sub);
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

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiBaseResponse(RoleResponseDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateRoleDto>,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<RoleResponseDto>> {
    return this.rolesService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiBaseResponse(SuccessResponseDto)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<SuccessResponseDto>> {
    return this.rolesService.remove(id, user.sub);
  }

}
