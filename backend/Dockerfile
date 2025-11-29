FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create data directories
RUN mkdir -p /data/uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
