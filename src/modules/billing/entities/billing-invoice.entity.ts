import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('billing_invoices')
export class BillingInvoice {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    name: 'invoice_number',
  })
  invoiceNumber: string;

  @Column({ type: 'bigint', unsigned: true, name: 'po_id' })
  poId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'project_id' })
  projectId: number;

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
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    name: 'tax_amount',
  })
  taxAmount: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    name: 'grand_total',
  })
  grandTotal: number;

  @Column({
    type: 'enum',
    enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'],
    default: 'DRAFT',
  })
  status: string;

  @Column({ type: 'date', nullable: true, name: 'invoice_date' })
  invoiceDate: Date;

  @Column({ type: 'date', nullable: true, name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true, name: 'paid_date' })
  paidDate: Date;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'document_url',
  })
  documentUrl: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    name: 'created_by',
  })
  createdById: number;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'po_id' })
  po: PurchaseOrder;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
