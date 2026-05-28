import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SupportTicketsService } from './support-tickets.service';
import {
  CreateSupportTicketDto,
  CreateSupportTicketDetailDto,
  UpdateSupportTicketDto,
} from './dto/support-ticket.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBaseResponse, ApiBaseListResponse } from '../../common/decorators/api-response.decorator';
import { SupportTicketResponseDto } from './dto/support-ticket-response.dto';
import { SupportTicketDetailResponseDto } from './dto/support-ticket-detail-response.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dtos/response.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly ticketsService: SupportTicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiBaseResponse(SupportTicketResponseDto)
  create(@Body() dto: CreateSupportTicketDto): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiBaseListResponse(SupportTicketResponseDto)
  findAll(@Query() query: PaginationDto): Promise<PaginatedResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details' })
  @ApiBaseResponse(SupportTicketResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.findOne(+id);
  }

  @Post(':id/details')
  @ApiOperation({ summary: 'Add detail/sub-issue to ticket' })
  @ApiBaseResponse(SupportTicketDetailResponseDto)
  addDetail(
    @Param('id') id: string,
    @Body() dto: CreateSupportTicketDetailDto,
  ): Promise<BaseResponseDto<SupportTicketDetailResponseDto>> {
    return this.ticketsService.addDetail(+id, dto);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get ticket details/sub-issues' })
  @ApiBaseListResponse(SupportTicketDetailResponseDto)
  getDetails(@Param('id') id: string): Promise<BaseResponseDto<SupportTicketDetailResponseDto[]>> {
    return this.ticketsService.getDetails(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update support ticket' })
  @ApiBaseResponse(SupportTicketResponseDto)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSupportTicketDto,
  ): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete support ticket' })
  remove(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    return this.ticketsService.remove(+id);
  }
}
