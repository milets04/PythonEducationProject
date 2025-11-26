# pyschool-backend/Dockerfile

# 1. Imagen base
FROM node:18-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copiar archivos de dependencias
COPY package*.json ./
# Copiar carpeta de Prisma (Importante para que genere el cliente)
COPY prisma ./prisma/

# 4. Instalar dependencias
RUN npm ci

# 5. Generar cliente de Prisma
RUN npx prisma generate

# 6. Copiar el código fuente (server.js, src, etc.)
COPY . .

# 7. Exponer el puerto (Asegúrate que server.js use process.env.PORT)
EXPOSE 8080

# 8. Iniciar el servidor
CMD ["node", "server.js"]