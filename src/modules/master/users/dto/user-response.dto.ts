import { BaseDto } from '../../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';

export class UserResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiPropertyOptional()
  @Expose()
  employeeId?: string;

  @ApiPropertyOptional()
  @Expose()
  avatarUrl?: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @Exclude()
  passwordHash?: string;
}
