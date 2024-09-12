// src/alerts/alerts.module.ts
import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAlertDto } from './dto/create-alert.dto'; // Ensure this path is correct

@Module({
  imports: [TypeOrmModule.forFeature([CreateAlertDto])],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
