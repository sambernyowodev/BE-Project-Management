import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../master/users/dto/user-response.dto';
import { RoleResponseDto } from '../../master/roles/dto/role-response.dto';
import { MasterProjectResponseDto } from '../../master/project/dto/project-response.dto';
import { ProjectStatus } from '../../../common/enums';

export class ProjectMemberResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  roleId: number;

  @ApiProperty()
  @Expose()
  assignedMandays: number;

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

export class ProjectResponseDto {

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiPropertyOptional()
  @Expose()
  picClient?: string;

  @ApiPropertyOptional()
  @Expose()
  picInternal?: string;

  @ApiPropertyOptional()
  @Expose()
  customer?: string;



  @ApiPropertyOptional()
  @Expose()
  parentProjectId?: number;

  @ApiProperty()
  @Expose()
  startDate: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  actualStart?: Date;

  @ApiPropertyOptional()
  @Expose()
  actualEnd?: Date;

  @ApiProperty({ enum: ProjectStatus })
  @Expose()
  status: ProjectStatus;

  @ApiPropertyOptional()
  @Expose()
  totalMandays?: number;

  @ApiPropertyOptional()
  @Expose()
  progressPct?: number;

  @ApiPropertyOptional()
  @Expose()
  repositoryLink?: string;

  @ApiPropertyOptional()
  @Expose()
  timelineLink?: string;

  @ApiPropertyOptional()
  @Expose()
  timelineRemark?: string;

  @ApiPropertyOptional()
  @Expose()
  remarks?: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional()
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  updatedAt?: Date;

  @ApiPropertyOptional({ type: () => MasterProjectResponseDto })
  @Expose()
  @Type(() => MasterProjectResponseDto)
  project?: MasterProjectResponseDto;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  parentProject?: ProjectResponseDto;
}
