import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('po_projects')
@Unique(['poId', 'projectId'])
export class PoProject extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'po_id' })
  poId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'project_id' })
  projectId: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    name: 'allocated_mandays',
  })
  allocatedMandays: number;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @ManyToOne(() => PurchaseOrder, (po) => po.poProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'po_id' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
