# Dockerfile para desarrollo con Node.js 20
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3211

# Comando para desarrollo con nodemon
CMD ["npm", "run", "dev"]