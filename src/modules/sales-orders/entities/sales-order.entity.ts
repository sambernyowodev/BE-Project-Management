import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { Project } from '../../project/entities/project.entity';
import { SalesOrderStatus } from '../../../common/enums';

@Entity('sales_orders')
export class SalesOrder extends BaseEntity {

  @Column({ type: 'varchar', length: 100, unique: true, name: 'so_number' })
  soNumber: string;

  @Column({ type: 'varchar', length: 255, name: 'so_name' })
  soName: string;

  @Column({ type: 'bigint', unsigned: true, name: 'po_id' })
  poId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'project_id' })
  projectId: number;

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
    enum: SalesOrderStatus,
    default: SalesOrderStatus.DRAFT,
  })
  status: SalesOrderStatus;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'date', nullable: true, name: 'delivery_date' })
  deliveryDate: Date;

  @Column({ type: 'date', nullable: true, name: 'invoice_date' })
  invoiceDate: Date;

  @Column({ type: 'date', nullable: true, name: 'payment_date' })
  paymentDate: Date;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'document_url',
  })
  documentUrl: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'po_id' })
  po: PurchaseOrder;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
