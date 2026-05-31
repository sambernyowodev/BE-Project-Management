import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MasterProjectsService } from '../providers/projects.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import {
  ApiBaseResponse,
  ApiBaseListResponse,
} from '../../../../common/decorators/api-response.decorator';
import { MasterProjectResponseDto } from '../dto/project-response.dto';
import {
  BaseResponseDto,
  PaginatedResponseDto,
  SuccessResponseDto,
} from '../../../../common/dtos/response.dto';
import { PaginationDto } from '../../../../common/dtos/pagination.dto';
import { CreateMasterProjectDto } from '../dto/project.dto';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Master Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master/projects')
export class MasterProjectsController {
  constructor(private readonly masterProjectsService: MasterProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all master projects' })
  @ApiBaseListResponse(MasterProjectResponseDto)
  findAll(
    @Query() query: PaginationDto,
  ): Promise<PaginatedResponseDto<MasterProjectResponseDto>> {
    return this.masterProjectsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get master project details' })
  @ApiBaseResponse(MasterProjectResponseDto)
  findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<MasterProjectResponseDto>> {
    return this.masterProjectsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new master project' })
  @ApiBaseResponse(MasterProjectResponseDto)
  create(
    @Body() dto: CreateMasterProjectDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto<MasterProjectResponseDto>> {
    return this.masterProjectsService.create(dto, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update master project' })
  @ApiBaseResponse(MasterProjectResponseDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMasterProjectDto>,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto<MasterProjectResponseDto>> {
    return this.masterProjectsService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete master project' })
  @ApiBaseResponse(SuccessResponseDto)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseDto<SuccessResponseDto>> {
    return this.masterProjectsService.remove(id);
  }
}
