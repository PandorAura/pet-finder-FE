# Stage 1: Build React
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package files first for better caching
COPY adoption-site/my-app/package*.json ./
RUN npm ci
# Copy remaining files
COPY adoption-site/my-app/ .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf