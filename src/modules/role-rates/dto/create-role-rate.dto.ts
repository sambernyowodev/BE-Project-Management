import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleRateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  projectId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ratePerManday: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  ratePerHour?: number;

  @ApiProperty({ required: false, default: 'IDR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: '2026-01-01' })
  @IsNotEmpty()
  @IsDateString()
  effectiveFrom: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsOptional()
  @IsDateString()
  effectiveUntil?: string;
}
