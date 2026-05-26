import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SupportTicketsService } from './support-tickets.service';
import {
  CreateSupportTicketDto,
  CreateSupportTicketDetailDto,
} from './dto/support-ticket.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly ticketsService: SupportTicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new support ticket' })
  create(@Body() dto: CreateSupportTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all support tickets' })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Post(':id/details')
  @ApiOperation({ summary: 'Add detail/sub-issue to ticket' })
  addDetail(
    @Param('id') id: string,
    @Body() dto: CreateSupportTicketDetailDto,
  ) {
    return this.ticketsService.addDetail(+id, dto);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get ticket details/sub-issues' })
  getDetails(@Param('id') id: string) {
    return this.ticketsService.getDetails(+id);
  }
}
