import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectActivitiesService } from '../providers/project-activities.service';
import { CreateProjectActivityDto, UpdateProjectActivityDto, UpdateProgressDto } from '../dto/project-activity.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../common/decorators/api-response.decorator';
import { ProjectActivityResponseDto } from '../dto/project-activity-response.dto';
import { BaseResponseDto, SuccessResponseDto } from '../../../common/dtos/response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';


@ApiTags('Project Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-activities')
export class ProjectActivitiesController {
  constructor(private readonly activitiesService: ProjectActivitiesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new project activity' })
  @ApiBaseResponse(ProjectActivityResponseDto)
  create(
    @Body() dto: CreateProjectActivityDto,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    return this.activitiesService.create(dto, user.sub);
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
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectActivityDto,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    return this.activitiesService.update(id, dto, user.sub);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Quick update activity progress percentage' })
  @ApiBaseResponse(ProjectActivityResponseDto)
  updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProgressDto,
    @CurrentUser() user: JwtPayload
  ): Promise<BaseResponseDto<ProjectActivityResponseDto>> {
    return this.activitiesService.updateProgress(id, dto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project activity' })
  @ApiBaseResponse(SuccessResponseDto)
  remove(
    @Param('id', ParseIntPipe) id: number): Promise<BaseResponseDto<SuccessResponseDto>> {
    return this.activitiesService.remove(id);
  }
}
