import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceHistory } from './entities/price-history.entity';
import { PricesService } from './price.service';

@Module({
  imports: [TypeOrmModule.forFeature([PriceHistory])],
  providers: [PricesService],
  exports: [PricesService, TypeOrmModule.forFeature([PriceHistory])], // Export repository
})
export class PricesModule {}
