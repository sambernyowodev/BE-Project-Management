import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PurchaseOrderStatus } from '../../../common/enums';
import { PoProjectResponseDto } from './po-project.dto';

export class PurchaseOrderResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  poNumber: string;

  @ApiProperty()
  @Expose()
  poName: string;

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

  @ApiProperty({ enum: PurchaseOrderStatus })
  @Expose()
  status: PurchaseOrderStatus;

  @ApiPropertyOptional()
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdById: number;

  @ApiPropertyOptional({ type: () => [PoProjectResponseDto] })
  @Expose()
  @Type(() => PoProjectResponseDto)
  poProjects?: PoProjectResponseDto[];

  @ApiProperty()
  @Expose()
  allocatedMandays: number;

  @ApiProperty()
  @Expose()
  remainingMandays: number;

  @ApiProperty()
  @Expose()
  projectCount: number;
}
