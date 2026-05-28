import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SalesOrdersService } from './sales-orders.service';
import { CreateSalesOrderDto } from './dto/sales-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SalesOrderStatus } from '../../common/enums';
import { ApiBaseResponse, ApiBaseListResponse } from '../../common/decorators/api-response.decorator';
import { SalesOrderResponseDto } from './dto/sales-order-response.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dtos/response.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';

@ApiTags('Sales Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sales-orders')
export class SalesOrdersController {
  constructor(private readonly soService: SalesOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SO' })
  @ApiBaseResponse(SalesOrderResponseDto)
  create(@Body() dto: CreateSalesOrderDto): Promise<BaseResponseDto<SalesOrderResponseDto>> {
    return this.soService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOs' })
  @ApiBaseListResponse(SalesOrderResponseDto)
  findAll(@Query() query: PaginationDto): Promise<PaginatedResponseDto<SalesOrderResponseDto>> {
    return this.soService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SO details' })
  @ApiBaseResponse(SalesOrderResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<SalesOrderResponseDto>> {
    return this.soService.findOne(+id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update SO Status' })
  @ApiBaseResponse(SalesOrderResponseDto)
  updateStatus(@Param('id') id: string, @Body('status') status: SalesOrderStatus): Promise<BaseResponseDto<SalesOrderResponseDto>> {
    return this.soService.updateStatus(+id, status);
  }
}
