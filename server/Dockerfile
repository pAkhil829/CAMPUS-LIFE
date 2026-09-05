# Multi-stage build to separate build dependencies from minimal production runtime
# Uses alpine base image to keep final footprint under 250MB. With basic image it was 1.7gb

# Stage 1: Builder phase for downlaoding dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production Runtime
FROM node:20-alpine
WORKDIR /app

# Switch to non-root user 
USER node

# Copy dependencies and application source
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node . .

ENV NODE_ENV=production
EXPOSE 5000

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
