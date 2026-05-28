import { BaseDto } from '../../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MasterProjectResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  projectCode: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  platform?: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;
}
