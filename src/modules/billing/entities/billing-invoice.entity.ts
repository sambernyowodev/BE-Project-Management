import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { Project } from '../../project/entities/project.entity';
import { InvoiceStatus } from '../../../common/enums';

@Entity('billing_invoices')
export class BillingInvoice extends BaseEntity {

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
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

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



  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'po_id' })
  po: PurchaseOrder;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;


}
