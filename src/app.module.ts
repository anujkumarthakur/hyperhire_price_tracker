import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertsModule } from './alerts/alerts.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432,       
      username: 'postgres', 
      password: 'Trodl@123', // Make sure this is handled as a string
      database: 'price_tracker', 
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    AlertsModule,
    PricesModule,
  ],
})
export class AppModule {}
