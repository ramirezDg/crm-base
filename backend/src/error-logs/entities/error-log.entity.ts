import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('error_logs')
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  stack?: string;

  @Column({ type: 'varchar', length: 150 })
  type: string;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @Column({ type: 'json', nullable: true })
  context?: any;

  @CreateDateColumn()
  createdAt: Date;
}
