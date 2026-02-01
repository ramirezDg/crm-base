import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;

  @Column({ length: 100 })
  entity: string;

  @Column({ type: 'uuid', nullable: true })
  entityId?: string;

  @Column({ length: 100, nullable: true })
  entityAction?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
