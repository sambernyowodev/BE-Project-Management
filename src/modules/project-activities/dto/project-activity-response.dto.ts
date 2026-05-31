import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../master/users/dto/user-response.dto';

export class ProjectActivityResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;

  @ApiProperty()
  @Expose()
  activityName: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  feature?: string;

  @ApiPropertyOptional()
  @Expose()
  subFeature?: string;

  @ApiPropertyOptional()
  @Expose()
  details?: string;

  @ApiProperty()
  @Expose()
  durationDays: number;

  @ApiProperty()
  @Expose()
  mandays: number;

  @ApiPropertyOptional()
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  actualStart?: Date;

  @ApiPropertyOptional()
  @Expose()
  actualEnd?: Date;

  @ApiProperty()
  @Expose()
  progressPct: number;

  @ApiProperty()
  @Expose()
  phase: string;

  @ApiPropertyOptional()
  @Expose()
  assignedToId?: number;

  @ApiProperty()
  @Expose()
  sortOrder: number;

  @ApiProperty()
  @Expose()
  isMilestone: boolean;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  assignedTo?: UserResponseDto;
}
