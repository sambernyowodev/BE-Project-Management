import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateBillingDto {
  @ApiProperty({ example: 'PROJECT', enum: ['PROJECT', 'SUPPORT'] })
  @IsNotEmpty()
  @IsEnum(['PROJECT', 'SUPPORT'])
  billingType: 'PROJECT' | 'SUPPORT';

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  projectIds?: number[];

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  supportTicketIds?: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}
