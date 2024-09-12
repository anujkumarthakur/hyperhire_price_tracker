"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PricesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm"); // Import MoreThanOrEqual
const price_history_entity_1 = require("./entities/price-history.entity");
let PricesService = PricesService_1 = class PricesService {
    constructor(priceHistoryRepository) {
        this.priceHistoryRepository = priceHistoryRepository;
        this.logger = new common_1.Logger(PricesService_1.name);
        this.MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2.2/erc20';
        this.MORALIS_API_KEY = process.env.MORALIS_API_KEY;
    }
    // Method to fetch prices from Moralis
    async fetchCurrentPrices(chain) {
        try {
            const url = `${this.MORALIS_API_URL}/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0/price?chain=${chain}&include=percent_change`;
            const headers = {
                Accept: 'application/json',
                'x-api-key': this.MORALIS_API_KEY,
            };
            const response = await axios_1.default.get(url, { headers });
            const data = response.data;
            // Save the fetched price data to the database
            await this.savePrice(chain, data.usdPrice);
            return data;
        }
        catch (error) {
            this.logger.error('Error fetching prices from Moralis', error);
            throw error;
        }
    }
    // Method to save price data to the database
    async savePrice(chain, price) {
        const priceHistory = new price_history_entity_1.PriceHistory();
        priceHistory.tokenSymbol = chain;
        priceHistory.price = price;
        priceHistory.timestamp = new Date();
        await this.priceHistoryRepository.save(priceHistory);
    }
    // Method to get hourly prices for the last 24 hours
    async getHourlyPrices() {
        const now = new Date();
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return this.priceHistoryRepository.find({
            where: {
                timestamp: (0, typeorm_2.MoreThanOrEqual)(twentyFourHoursAgo),
            },
            order: {
                timestamp: 'DESC',
            },
        });
    }
};
exports.PricesService = PricesService;
exports.PricesService = PricesService = PricesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(price_history_entity_1.PriceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PricesService);
