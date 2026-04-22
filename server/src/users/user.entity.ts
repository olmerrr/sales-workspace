import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from '../auth/session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  name!: string;

  @Column()
  bio!: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];
}
