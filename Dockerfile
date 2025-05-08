# Stage 1: Build Angular App
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build --prod

# Stage 2: Nginx Serve
FROM nginx:1.25.3-alpine
COPY nginx.conf /etc/nginx/nginx.conf

# ✅ SSR bo‘lmasa ham, index.html aynan browser/ ichida bo‘lgan — shu sabab
COPY --from=build /app/dist/suni_intelekt_loborotoriyasi/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
