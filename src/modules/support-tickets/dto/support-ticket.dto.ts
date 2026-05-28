import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  projectId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  issueTitle: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  issueDescription?: string;
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
  @IsString()
  projectName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  projectId?: number;

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
  @IsString()
  picClient?: string;

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
