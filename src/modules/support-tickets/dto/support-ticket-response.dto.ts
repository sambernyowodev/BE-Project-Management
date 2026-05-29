import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MasterProjectResponseDto } from '../../master/project/dto/project-response.dto';
import { UserResponseDto } from '../../master/users/dto/user-response.dto';
import { SupportTicketStatus } from '../../../common/enums';

export class SupportTicketResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  ticketCode: string;

  @ApiPropertyOptional()
  @Expose()
  masterProjectId?: number;

  @ApiPropertyOptional()
  @Expose()
  customer?: string;

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

  @ApiPropertyOptional({ type: () => MasterProjectResponseDto })
  @Expose()
  @Type(() => MasterProjectResponseDto)
  masterProject?: MasterProjectResponseDto;

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
