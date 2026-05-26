import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SalesOrdersService } from './sales-orders.service';
import { CreateSalesOrderDto } from './dto/sales-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Sales Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sales-orders')
export class SalesOrdersController {
  constructor(private readonly soService: SalesOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SO' })
  create(@Body() dto: CreateSalesOrderDto) {
    return this.soService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SOs' })
  findAll() {
    return this.soService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SO details' })
  findOne(@Param('id') id: string) {
    return this.soService.findOne(+id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update SO Status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.soService.updateStatus(+id, status);
  }
}
