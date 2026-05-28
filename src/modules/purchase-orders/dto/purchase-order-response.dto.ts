import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../project/dto/project-response.dto';
import { PurchaseOrderStatus } from '../../../common/enums';

export class PurchaseOrderResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  poNumber: string;

  @ApiProperty()
  @Expose()
  poName: string;

  @ApiProperty()
  @Expose()
  projectId: number;

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
}
