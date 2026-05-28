import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class BaseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiPropertyOptional()
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  updatedAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  createdBy?: number;

  @ApiPropertyOptional()
  @Expose()
  updatedBy?: number;
}
