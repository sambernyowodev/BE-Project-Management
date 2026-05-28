import { BaseEntity } from '../../../../common/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Project } from '../../../project/entities/project.entity';

@Entity('role_rates')
@Unique('uk_role_project_effective', ['roleId', 'projectId', 'effectiveFrom'])
export class RoleRate extends BaseEntity {

  @Column({ type: 'bigint', unsigned: true, name: 'role_id' })
  roleId: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    name: 'project_id',
  })
  projectId: number;

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
    precision: 12,
    scale: 2,
    default: 0,
    name: 'rate_per_hour',
  })
  ratePerHour: number;

  @Column({ type: 'varchar', length: 3, default: 'IDR' })
  currency: string;

  @Column({ type: 'date', name: 'effective_from' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true, name: 'effective_until' })
  effectiveUntil: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
