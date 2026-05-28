import { BaseEntity } from '../../../../common/entities/base.entity';
import {
  Entity,
  Column,
} from 'typeorm';

@Entity('master_projects')
export class MasterProject extends BaseEntity {

  @Column({ type: 'varchar', length: 50, unique: true, name: 'project_code' })
  projectCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  platform: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

}
