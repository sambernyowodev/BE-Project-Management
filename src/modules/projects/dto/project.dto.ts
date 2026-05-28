import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProjectStatus } from '../../../common/enums';

export class CreateProjectDto {
  @ApiProperty({ description: 'Master project ID (FK to master_projects)' })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picClient?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picInternal?: string;



  @ApiProperty({ required: false, description: 'Parent project ID (self-ref for support projects)' })
  @IsOptional()
  @IsNumber()
  parentProjectId?: number;

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
  totalMandays?: number;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ required: false, enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timelineRemark?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  progressPct?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  repositoryLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timelineLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class AddProjectMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  assignedMandays?: number;
}
