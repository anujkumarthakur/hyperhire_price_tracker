import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('price_history')
export class PriceHistory {
  @PrimaryGeneratedColumn()
  id: number =0;

  @Column()
  tokenSymbol: string = ''; 

  @Column()
  price: number = 0; 

  @Column()
  timestamp: Date = new Date();
}
