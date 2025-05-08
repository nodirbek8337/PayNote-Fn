# Stage 1
FROM node:22.12.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install --force
COPY . .
RUN ng build --configuration production  # <-- muhim o‘zgarish

# Stage 2
FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/suni_intelekt_loborotoriyasi /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
