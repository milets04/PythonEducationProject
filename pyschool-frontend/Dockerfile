# pyschool-frontend/Dockerfile

# 1. Usamos Node 20 (Mantenemos esto porque es mejor)
FROM node:20

# 2. Directorio
WORKDIR /app

# 3. Copiar package.json
COPY package.json ./

# 4. Instalar dependencias
RUN npm install

# --- CORRECCIÓN: Fijamos Prisma a la v5 para evitar errores de la v7 ---
RUN npm install prisma@5.22.0 @prisma/client@5.22.0

# 6. Copiar código fuente
COPY . .

# 7. Variable ficticia
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# 8. Generar cliente de Prisma
RUN npx prisma generate

# 9. Build de Next.js
RUN npm run build

# 10. Exponer puerto
EXPOSE 3000

# 11. Iniciar
CMD ["npm", "start"]