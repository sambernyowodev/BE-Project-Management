import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { RoleResponseDto } from '../../master/roles/dto/role-response.dto';
import { BillingStatus } from '../../../common/enums';

export class BillingDetailResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  billingId: number;

  @ApiPropertyOptional()
  @Expose()
  projectId?: number;

  @ApiProperty()
  @Expose()
  roleId: number;

  @ApiProperty()
  @Expose()
  mandays: number;

  @ApiProperty()
  @Expose()
  ratePerManday: number;

  @ApiProperty()
  @Expose()
  subtotal: number;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}

export class BillingResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  billingNumber: string;

  @ApiProperty()
  @Expose()
  billingType: string;

  @ApiProperty()
  @Expose()
  billingPeriodStart: Date;

  @ApiProperty()
  @Expose()
  billingPeriodEnd: Date;

  @ApiProperty()
  @Expose()
  totalMandays: number;

  @ApiProperty()
  @Expose()
  totalAmount: number;

  @ApiProperty({ enum: BillingStatus })
  @Expose()
  status: BillingStatus;

  @ApiPropertyOptional()
  @Expose()
  remarks?: string;

  @ApiPropertyOptional({ type: () => [ProjectResponseDto] })
  @Expose()
  @Type(() => ProjectResponseDto)
  projects?: ProjectResponseDto[];

  @ApiPropertyOptional({ type: () => [BillingDetailResponseDto] })
  @Expose()
  @Type(() => BillingDetailResponseDto)
  details?: BillingDetailResponseDto[];
}
