import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('sales_orders')
export class SalesOrder {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

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
    enum: [
      'DRAFT',
      'ACTIVE',
      'IN_PROGRESS',
      'DELIVERED',
      'INVOICED',
      'PAID',
      'CLOSED',
      'CANCELLED',
    ],
    default: 'DRAFT',
  })
  status: string;

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
