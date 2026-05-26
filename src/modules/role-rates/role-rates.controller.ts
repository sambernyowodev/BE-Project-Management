import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleRatesService } from './role-rates.service';
import { CreateRoleRateDto } from './dto/create-role-rate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Role Rates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('role-rates')
export class RoleRatesController {
  constructor(private readonly roleRatesService: RoleRatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role rate' })
  create(@Body() dto: CreateRoleRateDto) {
    return this.roleRatesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all role rates' })
  findAll() {
    return this.roleRatesService.findAll();
  }

  @Get('global')
  @ApiOperation({ summary: 'Get global role rates (no project tied)' })
  getGlobalRates() {
    return this.roleRatesService.getGlobalRates();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get role rates specific to a project' })
  getProjectRates(@Param('projectId') projectId: string) {
    return this.roleRatesService.getProjectRates(+projectId);
  }
}
