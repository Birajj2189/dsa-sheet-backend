# Use Node.js 20 as base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# --- Production Image ---
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package.json ./

# Environment variables (will be overridden by AWS/Docker Compose)
ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

# Start the server
CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]
