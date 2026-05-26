import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'PM' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Project Manager' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Handles project management' })
  @IsOptional()
  @IsString()
  description?: string;
}
