import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm'; // Import MoreThanOrEqual
import { PriceHistory } from './entities/price-history.entity';

// Define TypeScript interface for Moralis Price response
interface MoralisPriceResponse {
  nativePrice: {
    value: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  usdPrice: number;
  usdPriceFormatted: string;
  // Add other fields as needed...
}

@Injectable()
export class PricesService {
  private readonly logger = new Logger(PricesService.name);
  private readonly MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2.2/erc20';
  private readonly MORALIS_API_KEY = process.env.MORALIS_API_KEY;

  constructor(
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  // Method to fetch prices from Moralis
  async fetchCurrentPrices(chain: string): Promise<MoralisPriceResponse> {
    try {
      const url = `${this.MORALIS_API_URL}/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0/price?chain=${chain}&include=percent_change`;
      
      const headers = {
        Accept: 'application/json',
        'x-api-key': this.MORALIS_API_KEY,
      };

      const response = await axios.get<MoralisPriceResponse>(url, { headers });
      const data = response.data;

      // Save the fetched price data to the database
      await this.savePrice(chain, data.usdPrice);
      
      return data;
    } catch (error) {
      this.logger.error('Error fetching prices from Moralis', error);
      throw error;
    }
  }

  // Method to save price data to the database
  private async savePrice(chain: string, price: number) {
    const priceHistory = new PriceHistory();
    priceHistory.tokenSymbol = chain;
    priceHistory.price = price;
    priceHistory.timestamp = new Date();
    await this.priceHistoryRepository.save(priceHistory);
  }

   // Method to get hourly prices for the last 24 hours
   async getHourlyPrices(): Promise<PriceHistory[]> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return this.priceHistoryRepository.find({
      where: {
        timestamp: MoreThanOrEqual(twentyFourHoursAgo),
      },
      order: {
        timestamp: 'DESC',
      },
    });
  }
}
