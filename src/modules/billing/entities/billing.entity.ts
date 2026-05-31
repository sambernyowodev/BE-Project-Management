import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { BillingStatus } from '../../../common/enums';
import { BillingDetail } from '../entities/billing-detail.entity';

@Entity('billings')
export class Billing extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    name: 'billing_number',
  })
  billingNumber: string;

  @Column({ type: 'date', name: 'billing_period_start' })
  billingPeriodStart: Date;

  @Column({ type: 'date', name: 'billing_period_end' })
  billingPeriodEnd: Date;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    name: 'total_mandays',
  })
  totalMandays: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    name: 'total_amount',
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: BillingStatus,
    default: BillingStatus.DRAFT,
  })
  status: BillingStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'billing_type',
    default: 'PROJECT',
  })
  billingType: 'PROJECT' | 'SUPPORT';

  @ManyToMany(() => Project, { cascade: true })
  @JoinTable({
    name: 'billing_projects',
    joinColumn: { name: 'billing_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'project_id', referencedColumnName: 'id' },
  })
  projects: Project[];

  @OneToMany(() => BillingDetail, (detail) => detail.billing, { cascade: true })
  details: BillingDetail[];
}
