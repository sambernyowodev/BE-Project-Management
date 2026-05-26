import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupportTicket } from './support-ticket.entity';

@Entity('support_ticket_details')
export class SupportTicketDetail {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'support_ticket_id' })
  supportTicketId: number;

  @Column({ type: 'varchar', length: 500, name: 'sub_issue' })
  subIssue: string;

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
    enum: ['OPEN', 'IN_PROGRESS', 'DONE', 'ON_HOLD'],
    default: 'OPEN',
  })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  platform: string;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'dev_be_names',
  })
  devBeNames: string;

  @ManyToOne(() => SupportTicket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'support_ticket_id' })
  supportTicket: SupportTicket;
}
