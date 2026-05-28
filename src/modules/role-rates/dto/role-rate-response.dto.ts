import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

export class RoleRateResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  roleId: number;

  @ApiPropertyOptional()
  @Expose()
  projectId?: number;

  @ApiProperty()
  @Expose()
  ratePerManday: number;

  @ApiProperty()
  @Expose()
  ratePerHour: number;

  @ApiProperty()
  @Expose()
  currency: string;

  @ApiProperty()
  @Expose()
  effectiveFrom: Date;

  @ApiPropertyOptional()
  @Expose()
  effectiveUntil?: Date;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}
