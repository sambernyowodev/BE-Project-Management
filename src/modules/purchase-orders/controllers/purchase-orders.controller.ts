import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PurchaseOrdersService } from '../providers/purchase-orders.service';
import { CreatePurchaseOrderDto } from '../dto/purchase-order.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../common/decorators/api-response.decorator';
import { PurchaseOrderResponseDto } from '../dto/purchase-order-response.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../../common/dtos/response.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new PO' })
  @ApiBaseResponse(PurchaseOrderResponseDto)
  create(
    @Body() dto: CreatePurchaseOrderDto,
    @CurrentUser() user: JwtPayload): Promise<BaseResponseDto<PurchaseOrderResponseDto>> {
    return this.poService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all POs' })
  @ApiBaseListResponse(PurchaseOrderResponseDto)
  findAll(@Query() query: PaginationDto): Promise<PaginatedResponseDto<PurchaseOrderResponseDto>> {
    return this.poService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get PO details' })
  @ApiBaseResponse(PurchaseOrderResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<PurchaseOrderResponseDto>> {
    return this.poService.findOne(+id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get POs by Project' })
  @ApiBaseListResponse(PurchaseOrderResponseDto)
  findByProject(@Param('projectId') projectId: string): Promise<BaseResponseDto<PurchaseOrderResponseDto[]>> {
    return this.poService.findByProject(+projectId);
  }
}
