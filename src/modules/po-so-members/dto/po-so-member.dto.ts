import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPoSoMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  poId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  soId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectMemberId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  actualMandays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  actualHours?: number;
}
