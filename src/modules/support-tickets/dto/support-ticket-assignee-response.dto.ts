import { BaseDto } from '../../../common/dtos/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SupportTicketResponseDto } from './support-ticket-response.dto';
import { UserResponseDto } from '../../master/users/dto/user-response.dto';
import { RoleResponseDto } from '../../master/roles/dto/role-response.dto';
import { SupportTicketDetailStatus } from '../../../common/enums';

export class SupportTicketAssigneeResponseDto extends BaseDto {
  @ApiProperty()
  @Expose()
  supportTicketId: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiPropertyOptional()
  @Expose()
  roleId?: number;

  @ApiProperty()
  @Expose()
  hoursSpent: number;

  @ApiProperty({ enum: SupportTicketDetailStatus })
  @Expose()
  status: SupportTicketDetailStatus;

  @ApiPropertyOptional()
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  endDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  notes?: string;

  @ApiPropertyOptional({ type: () => SupportTicketResponseDto })
  @Expose()
  @Type(() => SupportTicketResponseDto)
  supportTicket?: SupportTicketResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}
