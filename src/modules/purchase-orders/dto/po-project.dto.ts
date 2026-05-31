import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

export class AddPoProjectDto {
  @ApiProperty({ description: 'The project ID to assign' })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({
    description: 'Allocated mandays for the project under this PO',
  })
  @IsNotEmpty()
  @IsNumber()
  allocatedMandays: number;

  @ApiPropertyOptional({ description: 'Optional remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class PoProjectResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  poId: number;

  @ApiProperty()
  @Expose()
  projectId: number;

  @ApiProperty()
  @Expose()
  allocatedMandays: number;

  @ApiPropertyOptional()
  @Expose()
  remarks?: string;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;
}
