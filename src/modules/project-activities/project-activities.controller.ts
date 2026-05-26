import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto } from './dto/project-activity.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Project Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-activities')
export class ProjectActivitiesController {
  constructor(private readonly activitiesService: ProjectActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project activity' })
  create(@Body() dto: CreateProjectActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all activities for a project' })
  findByProject(@Param('projectId') projectId: string) {
    return this.activitiesService.findByProject(+projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity details' })
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }
}
