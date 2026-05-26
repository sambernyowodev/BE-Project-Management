import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PO' })
  create(@Body() dto: CreatePurchaseOrderDto, @CurrentUser() user: any) {
    return this.poService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all POs' })
  findAll() {
    return this.poService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get PO details' })
  findOne(@Param('id') id: string) {
    return this.poService.findOne(+id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get POs by Project' })
  findByProject(@Param('projectId') projectId: string) {
    return this.poService.findByProject(+projectId);
  }
}
