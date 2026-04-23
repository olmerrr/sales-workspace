import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/user.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  company!: string;

  @Column({ default: 'new' })
  status!: string;

  @Column({ type: 'int' })
  value!: number;

  @Column()
  source!: string;

  @Column()
  ownerId!: number;

  @ManyToOne(() => User, (user) => user.leads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
