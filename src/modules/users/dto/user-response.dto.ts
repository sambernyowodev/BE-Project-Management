import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

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
}
