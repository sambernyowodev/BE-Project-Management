import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Billing } from './billing.entity';
import { Project } from '../../projects/entities/project.entity';
import { Role } from '../../master/roles/entities/role.entity';

@Entity('billing_details')
export class BillingDetail extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'billing_id' })
  billingId: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    name: 'project_id',
  })
  projectId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'role_id' })
  roleId: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  mandays: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    name: 'rate_per_manday',
  })
  ratePerManday: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @ManyToOne(() => Billing, (billing) => billing.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'billing_id' })
  billing: Billing;

  @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
