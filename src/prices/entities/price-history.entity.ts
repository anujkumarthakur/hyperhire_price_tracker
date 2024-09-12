import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class PriceHistory {
  @PrimaryGeneratedColumn()
  id!: number;  

  @Column()
  chain!: string;

  @Column('decimal')
  price!: number;

  @CreateDateColumn()
  timestamp!: Date;
}
