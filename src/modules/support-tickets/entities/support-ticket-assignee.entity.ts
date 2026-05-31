import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SupportTicket } from './support-ticket.entity';
import { User } from '../../master/users/entities/user.entity';
import { Role } from '../../master/roles/entities/role.entity';
import { SupportTicketDetailStatus } from '../../../common/enums';

@Entity('support_ticket_assignees')
export class SupportTicketAssignee extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'support_ticket_id' })
  supportTicketId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'role_id', nullable: true })
  roleId: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    default: 0,
    name: 'hours_spent',
  })
  hoursSpent: number;

  @Column({
    type: 'enum',
    enum: SupportTicketDetailStatus,
    default: SupportTicketDetailStatus.OPEN,
  })
  status: SupportTicketDetailStatus;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => SupportTicket, (ticket) => ticket.assignees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'support_ticket_id' })
  supportTicket: SupportTicket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
