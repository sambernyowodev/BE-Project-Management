import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PurchaseOrderResponseDto } from '../../purchase-orders/dto/purchase-order-response.dto';
import { ProjectMemberResponseDto } from '../../projects/dto/project-response.dto';
import { RoleResponseDto } from '../../master/roles/dto/role-response.dto';

export class PoMemberResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  poId: number;

  @ApiProperty()
  @Expose()
  projectMemberId: number;

  @ApiProperty()
  @Expose()
  roleId: number;

  @ApiProperty()
  @Expose()
  actualMandays: number;

  @ApiProperty()
  @Expose()
  actualHours: number;

  @ApiProperty()
  @Expose()
  ratePerManday: number;

  @ApiProperty()
  @Expose()
  totalCost: number;

  @ApiPropertyOptional()
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiProperty()
  @Expose()
  isBillable: boolean;

  @ApiPropertyOptional({ type: () => PurchaseOrderResponseDto })
  @Expose()
  @Type(() => PurchaseOrderResponseDto)
  po?: PurchaseOrderResponseDto;

  @ApiPropertyOptional({ type: () => ProjectMemberResponseDto })
  @Expose()
  @Type(() => ProjectMemberResponseDto)
  projectMember?: ProjectMemberResponseDto;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}
