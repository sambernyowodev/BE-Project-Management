import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleRateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ratePerMandayProject: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ratePerMandaySupport: number;

  @ApiProperty({ required: false, default: 'IDR' })
  @IsOptional()
  @IsString()
  currency?: string;
}
