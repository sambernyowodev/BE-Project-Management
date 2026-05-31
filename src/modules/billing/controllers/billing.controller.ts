import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BillingService } from '../providers/billing.service';
import { GenerateBillingDto } from '../dto/billing.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiBaseResponse, ApiBaseListResponse } from '../../../common/decorators/api-response.decorator';
import { BillingResponseDto } from '../dto/billing-response.dto';
import { BaseResponseDto } from '../../../common/dtos/response.dto';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('preview')
  @ApiOperation({ summary: 'Generate preview of billing calculations' })
  generatePreview(@Body() dto: GenerateBillingDto) {
    return this.billingService.generatePreview(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a billing record' })
  @ApiBaseResponse(BillingResponseDto)
  createBilling(@Body() dto: GenerateBillingDto, @CurrentUser() user: any): Promise<BaseResponseDto<BillingResponseDto>> {
    return this.billingService.createBilling(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all billing records' })
  @ApiBaseListResponse(BillingResponseDto)
  findAllBillings(): Promise<BaseResponseDto<BillingResponseDto[]>> {
    return this.billingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get billing details' })
  @ApiBaseResponse(BillingResponseDto)
  findOne(@Param('id') id: string): Promise<BaseResponseDto<BillingResponseDto>> {
    return this.billingService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a billing record' })
  @ApiBaseResponse(BaseResponseDto)
  remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
    return this.billingService.remove(+id);
  }
}

