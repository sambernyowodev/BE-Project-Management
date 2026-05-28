import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SupportTicketResponseDto } from './support-ticket-response.dto';
import { SupportTicketDetailStatus } from '../../../common/enums';

export class SupportTicketDetailResponseDto extends BaseDto {

  @ApiProperty()
  @Expose()
  supportTicketId: number;

  @ApiProperty()
  @Expose()
  subIssue: string;

  @ApiProperty()
  @Expose()
  hoursSpent: number;

  @ApiProperty({ enum: SupportTicketDetailStatus })
  @Expose()
  status: SupportTicketDetailStatus;

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
  devBeNames?: string;

  @ApiPropertyOptional({ type: () => SupportTicketResponseDto })
  @Expose()
  @Type(() => SupportTicketResponseDto)
  supportTicket?: SupportTicketResponseDto;
}
