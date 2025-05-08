# Stage 1: Build Angular App
FROM node:22.12.0 AS build

# Set working directory
WORKDIR /app

# Copy dependency files first (for cache optimization)
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install --force

# Copy all project files
COPY . .

# Build the Angular project in production mode
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:latest

# ✅ Nginx config to correct location:
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/suni_intelekt_loborotoriyasi /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]