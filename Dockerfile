FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
# Copy static files
COPY --from=builder /app/dist /usr/share/nginx/html
# Use regular config (not template)
COPY nginx.conf /etc/nginx/conf.d/default.conf