import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { MasterProject } from '../../master/project/entities/project.entity';
import { SupportTicketAssignee } from './support-ticket-assignee.entity';
import { SupportTicketStatus } from '../../../common/enums';

@Entity('support_tickets')
export class SupportTicket extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, name: 'ticket_code' })
  ticketCode: string;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    name: 'master_project_id',
  })
  masterProjectId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'pic_client' })
  picClient: string;

  @Column({ type: 'varchar', length: 500, name: 'issue_title' })
  issueTitle: string;

  @Column({ type: 'text', nullable: true, name: 'issue_description' })
  issueDescription: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    default: 0,
    name: 'hours_spent',
  })
  hoursSpent: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    default: 0,
    name: 'mandays_spent',
  })
  mandaysSpent: number;

  @Column({
    type: 'enum',
    enum: SupportTicketStatus,
    default: SupportTicketStatus.OPEN,
  })
  status: SupportTicketStatus;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'folder_attachment',
  })
  folderAttachment: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true, name: 'update_date' })
  updateDate: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => MasterProject)
  @JoinColumn({ name: 'master_project_id' })
  masterProject: MasterProject;

  @OneToMany(() => SupportTicketAssignee, (assignee) => assignee.supportTicket)
  assignees: SupportTicketAssignee[];
}
