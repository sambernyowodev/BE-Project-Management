import { BaseEntity } from '../../../../common/entities/base.entity';
import {
  Entity,
  Column,
} from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
