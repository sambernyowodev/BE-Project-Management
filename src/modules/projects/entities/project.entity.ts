import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'project_code' })
  projectCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'pic_client' })
  picClient: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  platform: string;

  @Column({
    type: 'enum',
    enum: [
      'PLANNING',
      'IN_PROGRESS',
      'SIT',
      'UAT',
      'CLOSED',
      'ON_HOLD',
      'CANCELLED',
    ],
    default: 'PLANNING',
  })
  status: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    name: 'total_mandays',
  })
  totalMandays: number;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_start' })
  actualStart: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_end' })
  actualEnd: Date;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    name: 'progress_pct',
  })
  progressPct: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'repository_link',
  })
  repositoryLink: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'timeline_link',
  })
  timelineLink: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    name: 'created_by',
  })
  createdById: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
