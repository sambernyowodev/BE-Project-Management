import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto } from './dto/project-activity.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../common/decorators/api-response.decorator';
import { ProjectActivityResponseDto } from './dto/project-activity-response.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';

@ApiTags('Project Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-activities')
export class ProjectActivitiesController {
  constructor(private readonly activitiesService: ProjectActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project activity' })
  @ApiBaseResponse(ProjectActivityResponseDto)
  create(@Body() dto: CreateProjectActivityDto): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    return this.activitiesService.create(dto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all activities for a project' })
  @ApiBaseListResponse(ProjectActivityResponseDto)
  findByProject(@Param('projectId') projectId: string): Promise<BaseResponseDto<ProjectActivityResponseDto[]>> {
    return this.activitiesService.findByProject(+projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity details' })
  @ApiBaseResponse(ProjectActivityResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    return this.activitiesService.findOne(+id);
  }
}
