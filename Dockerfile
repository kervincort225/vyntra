# Usa una imagen oficial de Node.js
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Build de la aplicación
RUN npm run build

EXPOSE 8080

CMD ["npm", "start", "--", "-p", "8080"]