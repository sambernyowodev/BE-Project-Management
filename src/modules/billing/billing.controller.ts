import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { GenerateInvoiceDto } from './dto/billing.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('preview')
  @ApiOperation({ summary: 'Generate preview of invoice calculations' })
  generatePreview(@Body() dto: GenerateInvoiceDto) {
    return this.billingService.generatePreview(dto);
  }

  @Post('invoice')
  @ApiOperation({ summary: 'Create an invoice based on actuals' })
  createInvoice(@Body() dto: GenerateInvoiceDto, @CurrentUser() user: any) {
    return this.billingService.createInvoice(dto, user.id);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  findAllInvoices() {
    return this.billingService.findAll();
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice details' })
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(+id);
  }
}
