# Stage 1: Build Angular App
FROM node:22.12.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install --force
COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:latest

# Copy nginx config (optional, lekin default.conf ni to'g'ri joyga joylashtirgan bo‘lsang)
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app (note: we go into /browser!)
COPY --from=build /app/dist/suni_intelekt_loborotoriyasi /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
