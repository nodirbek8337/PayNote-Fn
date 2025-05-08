# 1. Build bosqichi: Angular build
FROM node:18.18.0 AS build

# Ishchi katalog
WORKDIR /app

# Fayllarni konteynerga ko‘chirish
COPY . .

# Angular CLI lokal bo‘lsa ham, global o‘rnatib qo‘yiladi (npx kerak bo‘lmasin)
RUN npm install -g @angular/cli

# Dependenciyalarni o‘rnatish
RUN npm install

# Angular static build
RUN ng build --configuration production

# 2. Serve bosqichi: nginx orqali build natijasini servis qilish
FROM nginx:alpine

# Build qilingan fayllarni nginx katalogiga nusxalash
COPY --from=build /app/dist/suni_intelekt_loborotoriyasi /usr/share/nginx/html

# Routing (fallback) uchun konfiguratsiya
COPY nginx.conf /etc/nginx/conf.d/default.conf
