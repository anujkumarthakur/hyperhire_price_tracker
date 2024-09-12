import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chain!: string;

  @Column('decimal')
  price!: number;

  @Column()
  email!: string;
}
