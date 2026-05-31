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
import { SupportTicketsService } from '../providers/support-tickets.service';
import {
  CreateSupportTicketDto,
  CreateSupportTicketAssigneeDto,
  UpdateSupportTicketAssigneeDto,
  UpdateSupportTicketDto,
} from '../dto/support-ticket.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import {
  ApiBaseResponse,
  ApiBaseListResponse,
} from '../../../common/decorators/api-response.decorator';
import { SupportTicketResponseDto } from '../dto/support-ticket-response.dto';
import { SupportTicketAssigneeResponseDto } from '../dto/support-ticket-assignee-response.dto';
import {
  BaseResponseDto,
  PaginatedResponseDto,
  SuccessResponseDto,
} from '../../../common/dtos/response.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly ticketsService: SupportTicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiBaseResponse(SupportTicketResponseDto)
  create(
    @Body() dto: CreateSupportTicketDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiBaseListResponse(SupportTicketResponseDto)
  findAll(
    @Query() query: PaginationDto,
  ): Promise<PaginatedResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details' })
  @ApiBaseResponse(SupportTicketResponseDto)
  findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.findOne(+id);
  }

  @Post(':id/assignees')
  @ApiOperation({ summary: 'Assign a member to ticket' })
  @ApiBaseResponse(SupportTicketAssigneeResponseDto)
  addAssignee(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSupportTicketAssigneeDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto<SupportTicketAssigneeResponseDto>> {
    return this.ticketsService.addAssignee(id, dto, user.sub);
  }

  @Get(':id/assignees')
  @ApiOperation({ summary: 'Get ticket assignees' })
  @ApiBaseListResponse(SupportTicketAssigneeResponseDto)
  getAssignees(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<SupportTicketAssigneeResponseDto[]>> {
    return this.ticketsService.getAssignees(+id);
  }

  @Put(':id/assignees/:assigneeId')
  @ApiOperation({ summary: 'Update an assignee allocation' })
  @ApiBaseResponse(SupportTicketAssigneeResponseDto)
  updateAssignee(
    @Param('id', ParseIntPipe) ticketId: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
    @Body() dto: UpdateSupportTicketAssigneeDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto<SupportTicketAssigneeResponseDto>> {
    return this.ticketsService.updateAssignee(
      ticketId,
      assigneeId,
      dto,
      user.sub,
    );
  }

  @Delete(':id/assignees/:assigneeId')
  @ApiOperation({ summary: 'Remove an assignee from ticket' })
  @ApiBaseResponse(SuccessResponseDto)
  removeAssignee(
    @Param('id', ParseIntPipe) ticketId: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ): Promise<BaseResponseDto<SuccessResponseDto>> {
    return this.ticketsService.removeAssignee(ticketId, assigneeId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update support ticket' })
  @ApiBaseResponse(SupportTicketResponseDto)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSupportTicketDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto<SupportTicketResponseDto>> {
    return this.ticketsService.update(+id, dto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete support ticket' })
  @ApiBaseResponse(SuccessResponseDto)
  remove(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<SuccessResponseDto>> {
    return this.ticketsService.remove(+id);
  }
}
