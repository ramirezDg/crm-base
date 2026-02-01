import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CustomFieldValue } from '../../custom-field-values/entities/custom-field-value.entity';
import { EntityDefinition } from '../../entity-definitions/entities/entity-definition.entity';

@Entity()
export class CustomField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => EntityDefinition, (def) => def.fields)
  entityDefinition: EntityDefinition;

  @Column()
  entityType: string;

  @Column({ default: false })
  isRequired: boolean;

  @Column('simple-json', { nullable: true })
  options?: string[];

  @OneToMany(() => CustomFieldValue, (value) => value.customField)
  values: CustomFieldValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
