import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { ProjectPhase } from '../../../common/enums';

export class CreateProjectActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  activityName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feature?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subFeature?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mandays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPct?: number;

  @ApiProperty({ required: false, enum: ProjectPhase })
  @IsOptional()
  @IsEnum(ProjectPhase)
  phase?: ProjectPhase;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  assignedToId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isMilestone?: boolean;
}

export class UpdateProjectActivityDto extends PartialType(CreateProjectActivityDto) {}

export class UpdateProgressDto {
  @ApiProperty({ description: 'Progress percentage (0-100)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPct: number;
}
