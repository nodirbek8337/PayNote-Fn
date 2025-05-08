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

# Copy custom Nginx config if you have one (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular app from the first stage
COPY --from=build /app/dist/gym-front /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]