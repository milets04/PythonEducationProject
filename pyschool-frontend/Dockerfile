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
# 5. Instalar Prisma
RUN npm install prisma@5.22.0 @prisma/client@5.22.0

# --- CACHE BUSTER ---
# Agregamos un argumento que NUNCA está en caché si cambia su valor al construir,
# lo cual invalida el paso siguiente (COPY) y todos los posteriores.
ARG CACHE_BUSTER=V1_CACHE_BUSTER # <-- CAMBIA ESTE VALOR EN CADA RECONSTRUCCIÓN IMPORTANTE
# Si cambias 'V1_CACHE_BUSTER' a 'V2_CACHE_BUSTER', se forzará la reconstrucción.

# 6. Copiar código fuente (Este paso NO usará caché si el ARG anterior cambió)
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