import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  poName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customer: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
