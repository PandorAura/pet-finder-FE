FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first (critical for caching)
COPY adoption-site/my-app/package*.json ./  

RUN npm install

# Copy remaining files
COPY adoption-site/my-app/ ./

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf