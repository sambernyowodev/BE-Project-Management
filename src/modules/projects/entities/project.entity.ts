import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectStatus } from '../../../common/enums';
import { MasterProject } from '../../master/project/entities/project.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'project_id' })
  projectId: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'pic_client' })
  picClient: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'pic_internal',
  })
  picInternal: string;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    name: 'parent_project_id',
  })
  parentProjectId: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

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

  @Column({ type: 'text', nullable: true, name: 'timeline_remark' })
  timelineRemark: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => MasterProject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: MasterProject;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'parent_project_id' })
  parentProject: Project;
}
