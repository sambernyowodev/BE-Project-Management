import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'created_by' })
  createdBy: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'updated_by' })
  updatedBy: number;
}
