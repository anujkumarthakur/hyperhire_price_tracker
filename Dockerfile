# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the Nest.js application
RUN npm run build

# Command to run the application
CMD ["npm", "run", "start:prod"]
