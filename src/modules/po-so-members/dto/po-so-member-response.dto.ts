import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PurchaseOrderResponseDto } from '../../purchase-orders/dto/purchase-order-response.dto';
import { SalesOrderResponseDto } from '../../sales-orders/dto/sales-order-response.dto';
import { ProjectMemberResponseDto } from '../../projects/dto/project-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

export class PoSoMemberResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  poId: number;

  @ApiPropertyOptional()
  @Expose()
  soId?: number;

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

  @ApiPropertyOptional({ type: () => SalesOrderResponseDto })
  @Expose()
  @Type(() => SalesOrderResponseDto)
  so?: SalesOrderResponseDto;

  @ApiPropertyOptional({ type: () => ProjectMemberResponseDto })
  @Expose()
  @Type(() => ProjectMemberResponseDto)
  projectMember?: ProjectMemberResponseDto;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}
