import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto, UpdateProjectActivityDto, UpdateProgressDto } from './dto/project-activity.dto';
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

  @Put(':id')
  @ApiOperation({ summary: 'Update a project activity' })
  @ApiBaseResponse(ProjectActivityResponseDto)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectActivityDto,
  ): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    return this.activitiesService.update(+id, dto);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Quick update activity progress percentage' })
  @ApiBaseResponse(ProjectActivityResponseDto)
  updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateProgressDto,
  ): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    return this.activitiesService.updateProgress(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project activity' })
  remove(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    return this.activitiesService.remove(+id);
  }
}
