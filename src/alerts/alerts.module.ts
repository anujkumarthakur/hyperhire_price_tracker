import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { PriceHistory } from '../prices/entities/price-history.entity';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert, PriceHistory]),
    PricesModule, // Import PricesModule to make PriceHistory available
  ],
  providers: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
