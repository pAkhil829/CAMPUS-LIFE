# Stage 1: Compile the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Cache package manifests for efficient builds
COPY package*.json ./
RUN npm ci

# Copy source code and build the production bundle
COPY . .
RUN npm run build

# Stage 2: Serve compiled files using lightweight Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default static pages
RUN rm -rf ./*

# Copy compiled production assets from builder stage
COPY --from=builder /app/dist ./

# Use custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Standard HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
