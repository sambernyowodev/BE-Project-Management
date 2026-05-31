import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { PurchaseOrderStatus } from '../../../common/enums';
import { PoProject } from './po-project.entity';

@Entity('purchase_orders')
export class PurchaseOrder extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true, name: 'po_number' })
  poNumber: string;

  @Column({ type: 'varchar', length: 255, name: 'po_name' })
  poName: string;

  @Column({ type: 'varchar', length: 255 })
  customer: string;

  @Column({ type: 'text', nullable: true })
  description: string;

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
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => PoProject, (poProject) => poProject.purchaseOrder)
  poProjects: PoProject[];
}
