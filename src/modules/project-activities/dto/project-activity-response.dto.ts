import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

export class ProjectActivityResponseDto extends BaseDto {

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

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;
}
