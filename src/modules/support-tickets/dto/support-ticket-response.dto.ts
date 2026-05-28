import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { SupportTicketStatus } from '../../../common/enums';

export class SupportTicketResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  ticketCode: string;

  @ApiPropertyOptional()
  @Expose()
  projectId?: number;

  @ApiProperty()
  @Expose()
  projectName: string;

  @ApiPropertyOptional()
  @Expose()
  picClient?: string;

  @ApiProperty()
  @Expose()
  issueTitle: string;

  @ApiPropertyOptional()
  @Expose()
  issueDescription?: string;

  @ApiProperty()
  @Expose()
  hoursSpent: number;

  @ApiProperty()
  @Expose()
  mandaysSpent: number;

  @ApiProperty({ enum: SupportTicketStatus })
  @Expose()
  status: SupportTicketStatus;

  @ApiPropertyOptional()
  @Expose()
  platform?: string;

  @ApiPropertyOptional()
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  businessAnalystId?: number;

  @ApiPropertyOptional()
  @Expose()
  uiUxId?: number;

  @ApiPropertyOptional()
  @Expose()
  devFeId?: number;

  @ApiPropertyOptional()
  @Expose()
  devBeId?: number;

  @ApiPropertyOptional()
  @Expose()
  folderAttachment?: string;

  @ApiPropertyOptional()
  @Expose()
  notes?: string;

  @ApiPropertyOptional()
  @Expose()
  updateDate?: Date;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  businessAnalyst?: UserResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  uiUx?: UserResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  devFe?: UserResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  devBe?: UserResponseDto;
}
