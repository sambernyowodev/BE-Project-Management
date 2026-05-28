import { Controller, Get, Post, Body, Param, UseGuards, Query, Put, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleRatesService } from '../providers/role-rates.service';
import { CreateRoleRateDto } from '../dto/create-role-rate.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../../common/decorators/api-response.decorator';
import { RoleRateResponseDto } from '../dto/role-rate-response.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../../common/dtos/response.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Role Rates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('role-rates')
export class RoleRatesController {
  constructor(private readonly roleRatesService: RoleRatesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all role rates' })
  @ApiBaseListResponse(RoleRateResponseDto)
  findAll(@Query() query: PaginationDto): Promise<PaginatedResponseDto<RoleRateResponseDto>> {
    return this.roleRatesService.findAll(query);
  }

  @Get('global')
  @ApiOperation({ summary: 'Get global role rates (no project tied)' })
  @ApiBaseListResponse(RoleRateResponseDto)
  getGlobalRates(): Promise<BaseResponseDto<RoleRateResponseDto[]>> {
    return this.roleRatesService.getGlobalRates();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get role rates specific to a project' })
  @ApiBaseListResponse(RoleRateResponseDto)
  getProjectRates(@Param('projectId') projectId: string): Promise<BaseResponseDto<RoleRateResponseDto[]>> {
    return this.roleRatesService.getProjectRates(+projectId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role rate' })
  @ApiBaseResponse(RoleRateResponseDto)
  create(
    @Body() dto: CreateRoleRateDto,
    @CurrentUser() user: JwtPayload)
    : Promise<BaseResponseDto<RoleRateResponseDto>> {
    return this.roleRatesService.create(dto, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role rate' })
  @ApiBaseResponse(RoleRateResponseDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateRoleRateDto>,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<RoleRateResponseDto>> {
    return this.roleRatesService.update(id, dto, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role rate by id' })
  @ApiBaseResponse(RoleRateResponseDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseDto<RoleRateResponseDto>> {
    return this.roleRatesService.findOne(id);
  }
}
