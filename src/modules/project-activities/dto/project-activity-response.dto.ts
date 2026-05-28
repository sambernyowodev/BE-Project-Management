import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

export class ProjectActivityResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiProperty()
  @Expose()
  createdById: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  activityDate: Date;

  @ApiProperty()
  @Expose()
  mandaysLog: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  createdBy?: UserResponseDto;
}
