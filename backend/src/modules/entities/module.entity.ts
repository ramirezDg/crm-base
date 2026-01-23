import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('modules')
export class ModulesUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  path: string;

  @Column({ nullable: true, default: 'icon' })
  icon: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => ModulesUser, (module) => module.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: ModulesUser;

  @OneToMany(() => ModulesUser, (module) => module.parent)
  children: ModulesUser[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
