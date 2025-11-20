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
COPY --from=build /app/dist /usr/share/nginx/html

# Usa puerto 8022 según lo asignado
EXPOSE 8022
CMD ["nginx", "-g", "daemon off;"]