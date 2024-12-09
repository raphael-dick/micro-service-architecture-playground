# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the application (if applicable)
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
