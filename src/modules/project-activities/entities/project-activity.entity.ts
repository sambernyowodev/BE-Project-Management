import { BaseEntity } from '../../../common/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { ProjectPhase } from '../../../common/enums';

@Entity('project_activities')
export class ProjectActivity extends BaseEntity {

  @Column({ type: 'bigint', unsigned: true, name: 'project_id' })
  projectId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'parent_id' })
  parentId: number;

  @Column({ type: 'varchar', length: 255, name: 'activity_name' })
  activityName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  feature: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'sub_feature' })
  subFeature: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'int', default: 0, name: 'duration_days' })
  durationDays: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  mandays: number;

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

  @Column({
    type: 'enum',
    enum: ProjectPhase,
    default: ProjectPhase.DEVELOPMENT,
  })
  phase: ProjectPhase;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    name: 'assigned_to',
  })
  assignedToId: number;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @Column({ type: 'boolean', default: false, name: 'is_milestone' })
  isMilestone: boolean;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => ProjectActivity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: ProjectActivity;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;
}
