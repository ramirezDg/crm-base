import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Files {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  filename: string;

  @Column({ type: 'text' })
  originalName: string;

  @Column({ length: 500 })
  mimeType: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column()
  entityId: string;

  @Column({ nullable: true })
  checksum?: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
