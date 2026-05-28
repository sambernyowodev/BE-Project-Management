import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleRatesService } from './role-rates.service';
import { CreateRoleRateDto } from './dto/create-role-rate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../common/decorators/api-response.decorator';
import { RoleRateResponseDto } from './dto/role-rate-response.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';

@ApiTags('Role Rates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('role-rates')
export class RoleRatesController {
  constructor(private readonly roleRatesService: RoleRatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role rate' })
  @ApiBaseResponse(RoleRateResponseDto)
  create(@Body() dto: CreateRoleRateDto): Promise<BaseResponseDto<RoleRateResponseDto>> {
    return this.roleRatesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all role rates' })
  @ApiBaseListResponse(RoleRateResponseDto)
  findAll(): Promise<BaseResponseDto<RoleRateResponseDto[]>> {
    return this.roleRatesService.findAll();
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
}
