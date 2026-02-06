# Development Dockerfile (serving with Vite)
FROM node:24-alpine

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port 3000 (Vite)
EXPOSE 3000

# Start Vite server
CMD ["npm", "run", "dev"]
