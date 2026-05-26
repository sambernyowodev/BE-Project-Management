import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { SalesOrder } from '../../sales-orders/entities/sales-order.entity';
import { ProjectMember } from '../../projects/entities/project-member.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('po_so_members')
export class PoSoMember {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'po_id' })
  poId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'so_id' })
  soId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'project_member_id' })
  projectMemberId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'role_id' })
  roleId: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    name: 'actual_mandays',
  })
  actualMandays: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    name: 'actual_hours',
  })
  actualHours: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    name: 'rate_per_manday',
  })
  ratePerManday: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    name: 'total_cost',
  })
  totalCost: number;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'boolean', default: true, name: 'is_billable' })
  isBillable: boolean;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'po_id' })
  po: PurchaseOrder;

  @ManyToOne(() => SalesOrder)
  @JoinColumn({ name: 'so_id' })
  so: SalesOrder;

  @ManyToOne(() => ProjectMember)
  @JoinColumn({ name: 'project_member_id' })
  projectMember: ProjectMember;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
