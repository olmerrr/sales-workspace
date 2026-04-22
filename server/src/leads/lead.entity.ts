import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
