"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_entity_1 = require("./entities/alert.entity"); // Import the Alert entity
const price_history_entity_1 = require("../prices/entities/price-history.entity");
const nodemailer = __importStar(require("nodemailer"));
let AlertsService = AlertsService_1 = class AlertsService {
    constructor(alertRepository, priceHistoryRepository) {
        this.alertRepository = alertRepository;
        this.priceHistoryRepository = priceHistoryRepository;
        this.logger = new common_1.Logger(AlertsService_1.name);
    }
    // Method to create a new alert
    async createAlert(createAlertDto) {
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
            const relevantPrice = currentPrices.find((price) => price.tokenSymbol.toLowerCase() === alert.chain.toLowerCase());
            if (relevantPrice && relevantPrice.price >= alert.price) {
                // Send email if the current price has reached or exceeded the alert price
                await this.sendEmail(alert.email, `Price Alert for ${alert.chain}`, `The price of ${alert.chain} has reached ${relevantPrice.price} USD.`);
                this.logger.debug(`Email sent to ${alert.email} for ${alert.chain} at price ${relevantPrice.price}`);
            }
        }
    }
    // Method to send emails
    async sendEmail(to, subject, text) {
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
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = AlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(1, (0, typeorm_1.InjectRepository)(price_history_entity_1.PriceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AlertsService);
