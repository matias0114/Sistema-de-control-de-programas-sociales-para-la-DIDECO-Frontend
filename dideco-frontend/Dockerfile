# Etapa 1: Build del frontend
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir con NGINX
FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/*

# CRA genera /build, NO /dist
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
