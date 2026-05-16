# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Run
FROM nginx:alpine
COPY --from=build /app/dist/realworld-app/browser /usr/share/nginx/html
# Copiar configuração customizada do nginx para lidar com rotas do Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
