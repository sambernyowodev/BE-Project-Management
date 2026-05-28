import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { PurchaseOrderStatus } from '../../../common/enums';

@Entity('purchase_orders')
export class PurchaseOrder extends BaseEntity {

  @Column({ type: 'varchar', length: 100, unique: true, name: 'po_number' })
  poNumber: string;

  @Column({ type: 'varchar', length: 255, name: 'po_name' })
  poName: string;

  @Column({ type: 'bigint', unsigned: true, name: 'project_id' })
  projectId: number;

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

  @Column({ type: 'date', nullable: true, name: 'signed_date' })
  signedDate: Date;

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

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

}
