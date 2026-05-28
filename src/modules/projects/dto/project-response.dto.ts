import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';
import { ProjectStatus } from '../../../common/enums';

export class ProjectMemberResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  roleId: number;

  @ApiPropertyOptional()
  @Expose()
  secondaryRoleId?: number;

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

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  secondaryRole?: RoleResponseDto;
}

export class ProjectResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  projectCode: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  picClient?: string;

  @ApiPropertyOptional()
  @Expose()
  picInternal?: string;

  @ApiProperty()
  @Expose()
  startDate: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiProperty({ enum: ProjectStatus })
  @Expose()
  status: ProjectStatus;

  @ApiPropertyOptional()
  @Expose()
  timelineRemark?: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;
}
