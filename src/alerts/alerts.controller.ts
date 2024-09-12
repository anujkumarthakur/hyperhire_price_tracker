import { Controller, Post, Body } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAlertDto } from './dto/create-alert.dto';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  setPriceAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }
}
