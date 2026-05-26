import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mandays?: number;
}
