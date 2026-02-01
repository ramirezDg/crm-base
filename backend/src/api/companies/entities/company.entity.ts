import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { EntityDefinition } from '../../entity-definitions/entities/entity-definition.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ length: 15, nullable: true, default: null })
  phone: string;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => Users, (u) => u.company)
  users: Users[];

  @OneToMany(() => Client, (c) => c.company)
  clients: Client[];

  @OneToMany(() => EntityDefinition, (e) => e.company)
  entityDefinitions: EntityDefinition[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
