import {
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { CustomField } from '../../custom-fields/entities/custom-field.entity';

@Entity()
export class EntityDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Company, (company) => company.entityDefinitions)
  company: Company;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => CustomField, (field) => field.entityDefinition)
  fields: CustomField[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
