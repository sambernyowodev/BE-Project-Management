import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

export class PoSoMemberResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  orderId: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  roleId: number;

  @ApiProperty()
  @Expose()
  startDate: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}

export class OrderResponseDto {

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiProperty()
  @Expose()
  poNumber: string;

  @ApiProperty()
  @Expose()
  soNumber: string;

  @ApiProperty()
  @Expose()
  poDate: Date;

  @ApiProperty()
  @Expose()
  soDate: Date;

  @ApiProperty()
  @Expose()
  startDate: Date;

  @ApiProperty()
  @Expose()
  endDate: Date;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  currency?: string;

  @ApiPropertyOptional()
  @Expose()
  poAmount?: number;

  @ApiPropertyOptional()
  @Expose()
  soAmount?: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;
}
