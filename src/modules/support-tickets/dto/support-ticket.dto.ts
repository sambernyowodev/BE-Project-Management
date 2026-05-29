import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupportTicketDetailStatus } from '../../../common/enums';

export class CreateSupportTicketDto {
  @ApiProperty({ description: 'Master project ID (FK to master_projects)', required: false })
  @IsOptional()
  @IsNumber()
  masterProjectId?: number;

  @ApiProperty({ description: 'Master project name (used to find/create master project if masterProjectId is not provided)', required: false })
  @IsOptional()
  @IsString()
  masterProjectName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picClient?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  issueTitle: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  issueDescription?: string;
}

export class CreateSupportTicketAssigneeDto {
  @ApiProperty({ description: 'User ID of the assigned member' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Role ID of the assigned member', required: false })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  hoursSpent?: number;

  @ApiProperty({ enum: SupportTicketDetailStatus, required: false })
  @IsOptional()
  @IsEnum(SupportTicketDetailStatus)
  status?: SupportTicketDetailStatus;

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
  @IsString()
  notes?: string;
}

export class UpdateSupportTicketAssigneeDto {
  @ApiProperty({ description: 'Role ID of the assigned member', required: false })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  hoursSpent?: number;

  @ApiProperty({ enum: SupportTicketDetailStatus, required: false })
  @IsOptional()
  @IsEnum(SupportTicketDetailStatus)
  status?: SupportTicketDetailStatus;

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
  @IsString()
  notes?: string;
}

export class UpdateSupportTicketDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  masterProjectId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  masterProjectName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picClient?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  issueTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  issueDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  hoursSpent?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mandaysSpent?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
