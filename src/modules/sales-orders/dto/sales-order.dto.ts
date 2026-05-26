import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  soName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  poId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
