import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity'; // Import the Alert entity
import { PriceHistory } from '../prices/entities/price-history.entity';
import * as nodemailer from 'nodemailer';
import { CreateAlertDto } from './dto/create-alert.dto'; // Import CreateAlertDto

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectRepository(Alert) // Use the Alert entity here
    private alertRepository: Repository<Alert>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  // Method to create a new alert
  async createAlert(createAlertDto: CreateAlertDto) {
    const alert = this.alertRepository.create(createAlertDto); // Create instance from DTO
    await this.alertRepository.save(alert); // Save alert
    this.logger.debug('Alert created successfully!');
  }

  // Method to check and send alerts if needed
  async checkAndSendAlerts() {
    // Fetch the latest prices for Ethereum and Polygon
    const currentPrices = await this.priceHistoryRepository.find({
      order: { timestamp: 'DESC' },
      take: 2, // Assuming only Ethereum and Polygon
    });

    // Fetch all alerts from the database
    const alerts = await this.alertRepository.find();

    // Loop through all alerts and check if conditions are met
    for (const alert of alerts) {
      const relevantPrice = currentPrices.find(
        (price) => price.tokenSymbol.toLowerCase() === alert.chain.toLowerCase(),
      );

      if (relevantPrice && relevantPrice.price >= alert.price) {
        // Send email if the current price has reached or exceeded the alert price
        await this.sendEmail(
          alert.email,
          `Price Alert for ${alert.chain}`,
          `The price of ${alert.chain} has reached ${relevantPrice.price} USD.`,
        );
        this.logger.debug(
          `Email sent to ${alert.email} for ${alert.chain} at price ${relevantPrice.price}`,
        );
      }
    }
  }

  // Method to send emails
  async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to,
      subject,
      text,
    });

    this.logger.debug(`Email sent to ${to} with subject "${subject}"`);
  }
}
