import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BillingService } from '../providers/billing.service';
import { GenerateInvoiceDto } from '../dto/billing.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../common/decorators/api-response.decorator';
import { BillingInvoiceResponseDto } from '../dto/billing-response.dto';
import { BaseResponseDto } from '../../../common/dtos/response.dto';

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
  @ApiBaseResponse(BillingInvoiceResponseDto)
  createInvoice(@Body() dto: GenerateInvoiceDto, @CurrentUser() user: any): Promise<BaseResponseDto<BillingInvoiceResponseDto>> {
    return this.billingService.createInvoice(dto, user.id);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiBaseListResponse(BillingInvoiceResponseDto)
  findAllInvoices(): Promise<BaseResponseDto<BillingInvoiceResponseDto[]>> {
    return this.billingService.findAll();
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice details' })
  @ApiBaseResponse(BillingInvoiceResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<BillingInvoiceResponseDto>> {
    return this.billingService.findOne(+id);
  }
}
