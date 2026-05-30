import { BaseDto } from '../../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

export class RoleRateResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  roleId: number;

  @ApiProperty()
  @Expose()
  ratePerMandayProject: number;

  @ApiProperty()
  @Expose()
  ratePerMandaySupport: number;

  @ApiProperty()
  @Expose()
  currency: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}

