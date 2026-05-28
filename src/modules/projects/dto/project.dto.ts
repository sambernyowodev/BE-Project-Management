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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picClient?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customer?: string;
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
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
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
  secondaryRoleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  assignedMandays?: number;
}
