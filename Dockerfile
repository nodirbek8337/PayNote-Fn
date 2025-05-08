# Stage 1: Build Angular App
FROM node:20.12.2-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install --force
COPY . .
RUN npm run build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/suni_intelekt_loborotoriyasi /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
