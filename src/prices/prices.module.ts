// src/prices/prices.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesService } from './price.service';
import { PricesController } from './price.controller';
import { PriceHistory } from './entities/price-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceHistory])],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
