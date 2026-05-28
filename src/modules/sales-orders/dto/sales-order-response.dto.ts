import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { PurchaseOrderResponseDto } from '../../purchase-orders/dto/purchase-order-response.dto';
import { SalesOrderStatus } from '../../../common/enums';

export class SalesOrderResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  soNumber: string;

  @ApiProperty()
  @Expose()
  soName: string;

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiProperty()
  @Expose()
  purchaseOrderId: number;

  @ApiProperty()
  @Expose()
  customer: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  totalMandays: number;

  @ApiProperty()
  @Expose()
  totalAmount: number;

  @ApiProperty({ enum: SalesOrderStatus })
  @Expose()
  status: SalesOrderStatus;

  @ApiPropertyOptional()
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  signedDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  documentUrl?: string;

  @ApiPropertyOptional()
  @Expose()
  remarks?: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdById: number;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;

  @ApiPropertyOptional({ type: () => PurchaseOrderResponseDto })
  @Expose()
  @Type(() => PurchaseOrderResponseDto)
  purchaseOrder?: PurchaseOrderResponseDto;
}
