import { BaseEntity } from '../../../../common/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('role_rates')
export class RoleRate extends BaseEntity {

  @Column({ type: 'bigint', unsigned: true, name: 'role_id' })
  roleId: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    name: 'rate_per_manday_project',
  })
  ratePerMandayProject: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    name: 'rate_per_manday_support',
  })
  ratePerMandaySupport: number;

  @Column({ type: 'varchar', length: 3, default: 'IDR' })
  currency: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}

