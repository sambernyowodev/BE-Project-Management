import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BillingInvoice } from './billing-invoice.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('billing_invoice_details')
export class BillingInvoiceDetail extends BaseEntity {

  @Column({ type: 'bigint', unsigned: true, name: 'invoice_id' })
  invoiceId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'role_id' })
  roleId: number;

  @Column({ type: 'varchar', length: 255, name: 'member_name' })
  memberName: string;

  @Column({ type: 'varchar', length: 100, name: 'role_name' })
  roleName: string;

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

  @ManyToOne(() => BillingInvoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: BillingInvoice;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
