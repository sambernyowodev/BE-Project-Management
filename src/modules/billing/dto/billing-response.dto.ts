import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { PurchaseOrderResponseDto } from '../../purchase-orders/dto/purchase-order-response.dto';
import { UserResponseDto } from '../../master/users/dto/user-response.dto';
import { RoleResponseDto } from '../../master/roles/dto/role-response.dto';
import { InvoiceStatus } from '../../../common/enums';

export class BillingInvoiceDetailResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  billingInvoiceId: number;

  @ApiPropertyOptional()
  @Expose()
  roleId?: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  totalMandays: number;

  @ApiProperty()
  @Expose()
  ratePerManday: number;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}

export class BillingInvoiceResponseDto {

  @ApiProperty()
  @Expose()
  invoiceNumber: string;

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiPropertyOptional()
  @Expose()
  poId?: number;

  @ApiProperty()
  @Expose()
  periodStart: Date;

  @ApiProperty()
  @Expose()
  periodEnd: Date;

  @ApiProperty()
  @Expose()
  totalAmount: number;

  @ApiProperty({ enum: InvoiceStatus })
  @Expose()
  status: InvoiceStatus;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdById: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;

  @ApiPropertyOptional({ type: () => PurchaseOrderResponseDto })
  @Expose()
  @Type(() => PurchaseOrderResponseDto)
  po?: PurchaseOrderResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  createdBy?: UserResponseDto;

  @ApiPropertyOptional({ type: () => [BillingInvoiceDetailResponseDto] })
  @Expose()
  @Type(() => BillingInvoiceDetailResponseDto)
  details?: BillingInvoiceDetailResponseDto[];
}
