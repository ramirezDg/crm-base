import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CustomField } from '../../custom-fields/entities/custom-field.entity';

@Entity()
export class CustomFieldValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomField, (field) => field.values)
  customField: CustomField;

  @Column()
  entityInstanceId: string;

  @Column('text')
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
