# Use Node 18 base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variable for port (Google Cloud Run uses PORT)
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
