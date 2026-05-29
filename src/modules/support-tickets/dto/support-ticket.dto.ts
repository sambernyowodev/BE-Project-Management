import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  businessAnalystId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  uiUxId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  devFeId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  devBeId?: number;
}

export class CreateSupportTicketDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subIssue: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  hoursSpent?: number;
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  businessAnalystId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  uiUxId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  devFeId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  devBeId?: number;
}
