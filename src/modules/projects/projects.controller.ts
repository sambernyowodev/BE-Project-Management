import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBaseResponse, ApiBaseListResponse } from '../../common/decorators/api-response.decorator';
import { ProjectResponseDto, ProjectMemberResponseDto } from './dto/project-response.dto';
import { BaseResponseDto } from '../../common/dtos/response.dto';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto } from './dto/project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBaseResponse(ProjectResponseDto)
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: any): Promise<BaseResponseDto<ProjectResponseDto>> {
    return this.projectsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiBaseListResponse(ProjectResponseDto)
  findAll(): Promise<BaseResponseDto<ProjectResponseDto[]>> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  @ApiBaseResponse(ProjectResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<ProjectResponseDto>> {
    return this.projectsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiBaseResponse(ProjectResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto): Promise<BaseResponseDto<ProjectResponseDto>> {
    return this.projectsService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    return this.projectsService.remove(+id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get project members' })
  @ApiBaseListResponse(ProjectMemberResponseDto)
  getMembers(@Param('id') id: string): Promise<BaseResponseDto<ProjectMemberResponseDto[]>> {
    return this.projectsService.getMembers(+id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to project' })
  @ApiBaseResponse(ProjectMemberResponseDto)
  addMember(@Param('id') id: string, @Body() dto: AddProjectMemberDto): Promise<BaseResponseDto<ProjectMemberResponseDto>> {
    return this.projectsService.addMember(+id, dto);
  }
}
