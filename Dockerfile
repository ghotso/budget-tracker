FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Create data directory
RUN mkdir -p /app/data

# Copy and make init script executable
COPY init-db.sh /app/
RUN chmod +x /app/init-db.sh

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "/app/init-db.sh && npm start"]
