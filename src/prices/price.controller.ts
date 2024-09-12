import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './price.service';
import { ApiTags } from '@nestjs/swagger';
import { PriceHistory } from './entities/price-history.entity';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('fetch')
  async fetchCurrentPrices(@Query('chain') chain: string) {
    return this.pricesService.fetchCurrentPrices(chain);
  }

  @Get('hourly')
  getHourlyPrices(): Promise<PriceHistory[]> {
    return this.pricesService.getHourlyPrices();
  }
}
