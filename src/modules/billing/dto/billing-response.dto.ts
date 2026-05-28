import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { PurchaseOrderResponseDto } from '../../purchase-orders/dto/purchase-order-response.dto';
import { SalesOrderResponseDto } from '../../sales-orders/dto/sales-order-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';
import { InvoiceStatus } from '../../../common/enums';

export class BillingInvoiceDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

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
  id: number;

  @ApiProperty()
  @Expose()
  invoiceNumber: string;

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiPropertyOptional()
  @Expose()
  poId?: number;

  @ApiPropertyOptional()
  @Expose()
  soId?: number;

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

  @ApiPropertyOptional({ type: () => SalesOrderResponseDto })
  @Expose()
  @Type(() => SalesOrderResponseDto)
  so?: SalesOrderResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  createdBy?: UserResponseDto;

  @ApiPropertyOptional({ type: () => [BillingInvoiceDetailResponseDto] })
  @Expose()
  @Type(() => BillingInvoiceDetailResponseDto)
  details?: BillingInvoiceDetailResponseDto[];
}
