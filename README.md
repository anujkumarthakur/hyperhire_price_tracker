```markdown
# Blockchain Price Tracker

This is a blockchain price tracker application built using Nest.js. The application fetches and saves the prices of Ethereum and Polygon every 5 minutes. It also provides APIs to fetch hourly prices for the last 24 hours and set price alerts, notifying users via email when certain conditions are met.

## Features

- Automatic Price Fetching**: Fetches the prices of Ethereum and Polygon every 5 minutes.
- Email Alerts**: Sends an email if the price of a chain increases by more than 3% compared to its price one hour ago.
- API to Retrieve Prices**: Provides hourly prices of Ethereum and Polygon for the last 24 hours.
- API to Set Alerts**: Allows users to set price alerts and receive email notifications.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Setup

1. Clone the Repository:
   git clone https://github.com/yourusername/blockchain-price-tracker.git
   cd blockchain-price-tracker

2. Install Dependencies:
   npm install

3. Configure Environment Variables:

   Create a `.env` file in the root directory and add the following environment variables:

   DATABASE_URL=postgresql://username:password@localhost:5432/blockchain_price_tracker
   EMAIL_SERVICE_USER=your_email@example.com
   EMAIL_SERVICE_PASSWORD=your_email_password
   MORALIS_API_KEY=your_moralis_api_key

4. Build and Run with Docker:

   Make sure Docker is running on your local machine. Then, use the following command to build and run the application:

   docker-compose up --build

   The application will be available at `http://localhost:3000`.

## API Documentation

### 1. Fetch Hourly Prices

- Endpoint: `GET /prices/history`
- Description: Retrieves the hourly prices of a specific blockchain (e.g., Ethereum or Polygon) for the last 24 hours.
- Parameters:
  - `chain` (query parameter): The name of the blockchain (e.g., `Ethereum`, `Polygon`).
- Response: Returns a list of price entries for each hour within the last 24 hours.

#### Example Request

curl -X GET 'http://localhost:3000/prices/history?chain=Ethereum'

#### Example Response

[
  { "timestamp": "2024-09-10T00:00:00Z", "price": 1800.00 },
  { "timestamp": "2024-09-10T01:00:00Z", "price": 1815.25 },
  ...
]

### 2. Set Price Alert

- Endpoint: `POST /alerts/set`
- Description: Allows users to set an alert for a specific price. Sends an email when the price of a blockchain reaches the specified value.
- Parameters:
  - `chain` (in the request body): The name of the blockchain (e.g., `Ethereum`, `Polygon`).
  - `price` (in the request body): The target price that will trigger the alert.
  - `email` (in the request body): The email address where the alert should be sent.
- Response: Confirms the creation of the alert.

#### Example Request

curl -X POST 'http://localhost:3000/alerts/set' \
-H 'Content-Type: application/json' \
-d '{
  "chain": "Ethereum",
  "price": 2000,
  "email": "user@example.com"
}'

#### Example Response
{
  "message": "Alert set successfully for Ethereum at $2000."
}

## Scheduled Tasks

1. Price Fetching Task:
   - Runs every 5 minutes to fetch and save the latest prices of Ethereum and Polygon.
   - Implemented using the `@nestjs/schedule` package.

2. Price Change Alert Checker:
   - Runs every 5 minutes to check if the price of any chain has increased by more than 3% compared to its price one hour ago.
   - Sends an email alert if the condition is met.
