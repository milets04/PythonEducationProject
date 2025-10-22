# PYSON - Sistema de Enseñanza de Python


## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Flujo de Registro y Aprobación](#-flujo-de-registro-y-aprobación)
- [API Endpoints](#-api-endpoints)
- [Roles y Permisos](#-roles-y-permisos)
- [Scripts Disponibles](#-scripts-disponibles)
- [Guía de Uso](#-guía-de-uso)
- [Troubleshooting](#-troubleshooting)
- [Contribución](#-contribución)

---

## Características

-  **Autenticación JWT** segura con tokens de 24 horas
-  **Sistema de roles** flexible (Estudiante, Profesor Editor, Profesor Executor, Administrador)
-  **Aprobación administrativa** de nuevos usuarios antes de acceder al sistema
-  **Hash de contraseñas** con bcrypt
-  **Arquitectura por capas** (Routes → Controllers → Services → DB)
-  **ORM Prisma** para gestión de base de datos
-  **PostgreSQL** como base de datos relacional
-  **Gestión masiva** de aprobaciones y rechazos
-  **Soft delete** de usuarios rechazados
-  **Auditoría** de quién aprueba/rechaza usuarios

---

##  Tecnologías

- **Node.js** v18+ 
- **Express.js** v4.18 - Framework web
- **PostgreSQL** v15 - Base de datos
- **Prisma ORM** v5.7 - Object-Relational Mapping
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hash de contraseñas
- **Helmet** - Seguridad HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

---

##  Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **PostgreSQL** v15 o superior ([Descargar](https://www.postgresql.org/download/))
- **npm** o **yarn** (viene con Node.js)
- **Git** (opcional, para clonar el repositorio)

### Verificar instalaciones:

```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
psql --version    # Debe mostrar PostgreSQL 15.x
```

---

##  Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd pyschool-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos PostgreSQL

**Opción A: Instalación local**

```bash
# Crear la base de datos
createdb virtual_school

# O desde psql
psql -U postgres
CREATE DATABASE virtual_school;
\q
```

**Opción B: Docker (Recomendado para desarrollo)**

```bash
docker run --name postgres-virtualschool \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=virtual_school \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

**.env:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/virtual_school"
PORT=5000
NODE_ENV="development"
JWT_SECRET="tu_secreto_super_seguro_cambiar_en_produccion"
JWT_EXPIRE="24h"
```

### 5. Generar cliente Prisma y ejecutar migraciones

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones (crear tablas)
npm run prisma:migrate

# Cuando pregunte el nombre, escribe: init
```

### 6. Crear el primer administrador

```bash
npm run seed
```

Esto creará un administrador con:
- **Email:** admin@virtualschool.com
- **Password:** Admin123

**IMPORTANTE:** Cambia esta contraseña después del primer login.

### 7. Iniciar el servidor

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: **http://localhost:5000**

---

##  Configuración

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `PORT` | Puerto del servidor | `5000` |
| `NODE_ENV` | Ambiente de ejecución | `development` o `production` |
| `JWT_SECRET` | Secreto para firmar tokens | Cadena aleatoria larga |
| `JWT_EXPIRE` | Tiempo de expiración del token | `24h`, `7d`, `30m` |

### Ejemplo de .env completo:

```env
DATABASE_URL="postgresql://postgres:secreto123@localhost:5432/virtual_school"
PORT=5000
NODE_ENV="development"
JWT_SECRET="mi_secreto_super_seguro_que_nadie_puede_adivinar_12345"
JWT_EXPIRE="24h"
CORS_ORIGIN="http://localhost:3000"
```

---

##  Estructura del Proyecto

```
pyschool-backend/
├── src/
│   ├── config/
│   │   └── environment.js         # Configuración de variables de entorno
│   │
│   ├── controllers/
│   │   └── authController.js      # Controladores de autenticación
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # Rutas de autenticación
│   │   └── protectedRoutes.js     # Rutas protegidas de ejemplo
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # Verificación de JWT
│   │   └── roleMiddleware.js      # Verificación de roles
│   │
│   ├── services/
│   │   └── authService.js         # Lógica de negocio de auth
│   │
│   ├── utils/
│   │   ├── passwordUtils.js       # Funciones de bcrypt
│   │   └── tokenUtils.js          # Funciones de JWT
│   │
│   ├── prisma/
│   │   └── schema.prisma          # Esquema de base de datos
│   │
│   └── app.js                     # Configuración de Express
│
├── prisma/
│   └── seed.js                    # Script para crear admin inicial
│
├── .env                           # Variables de entorno (NO COMMITEAR)
├── .env.example                   # Ejemplo de variables
├── .gitignore
├── package.json
├── README.md
└── server.js                      # Punto de entrada
```

---

##  Flujo de Registro y Aprobación

### 1 Usuario se Registra

```
Usuario → POST /api/auth/register
          ↓
     Se crea con:
     - roleId: 1 (estudiante por defecto)
     - isApproved: false
          ↓
     Mensaje: "Espera aprobación del administrador"
```

### 2 Usuario Intenta Iniciar Sesión

```
Usuario → POST /api/auth/login
          ↓
     isApproved === false?
          ↓
     Error: "Tu cuenta aún no ha sido aprobada"
```

### 3 Administrador Revisa Solicitudes

```
Admin → GET /api/auth/users/pending
        ↓
   Lista de usuarios pendientes:
   [
     {id: 1, name: "Juan", email: "juan@...", role: "student"},
     {id: 2, name: "María", email: "maria@...", role: "student"}
   ]
```

### 4 Administrador Aprueba/Rechaza

**Aprobar individualmente:**
```
Admin → PUT /api/auth/users/1/approve
        Body: { roleId: 2 }  // Asignar como profesor editor
        ↓
   Usuario aprobado con nuevo rol
```

**Rechazar individualmente:**
```
Admin → PUT /api/auth/users/2/reject
        ↓
   Usuario rechazado (soft delete)
```

**Aprobación masiva:**
```
Admin → POST /api/auth/users/bulk-approve
        Body: {
          approvals: [
            {userId: 3, roleId: 1},
            {userId: 4, roleId: 3}
          ]
        }
        ↓
   Múltiples usuarios aprobados
```

### 5 Usuario Aprobado Inicia Sesión

```
Usuario → POST /api/auth/login
          ↓
     isApproved === true ✓
          ↓
     Recibe JWT token
          ↓
     Accede al sistema
```

---

##  API Endpoints

### Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/health` | Verificar estado del servidor |

### Endpoints Protegidos (Requieren Token)

| Método | Endpoint | Rol Requerido | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/auth/logout` | Cualquiera | Cerrar sesión |
| GET | `/api/auth/me` | Cualquiera | Info del usuario actual |

### Endpoints de Administración (Solo Admin)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/users` | Todos los usuarios |
| GET | `/api/auth/users/pending` | Usuarios pendientes |
| PUT | `/api/auth/users/:id/approve` | Aprobar usuario |
| PUT | `/api/auth/users/:id/reject` | Rechazar usuario |
| POST | `/api/auth/users/bulk-approve` | Aprobar múltiples |
| POST | `/api/auth/users/bulk-reject` | Rechazar múltiples |

### Ejemplos de Uso

**1. Registrar usuario:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "Password123",
    "passwordConfirm": "Password123"
  }'
```

**2. Login como administrador:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@virtualschool.com",
    "password": "Admin123"
  }'
```

**3. Ver usuarios pendientes:**
```bash
curl -X GET http://localhost:5000/api/auth/users/pending \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**4. Aprobar usuario:**
```bash
curl -X PUT http://localhost:5000/api/auth/users/1/approve \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": 2
  }'
```

---

##  Roles y Permisos

### Roles Disponibles

| ID | Nombre | Descripción | Permisos |
|----|--------|-------------|----------|
| 1 | `student` | Estudiante | Ver contenido, completar ejercicios |
| 2 | `editorTeacher` | Profesor Editor | Crear/editar cursos y contenidos |
| 3 | `executorTeacher` | Profesor Executor | Impartir materia, hacer seguimiento |
| 4 | `administrator` | Administrador | Control total del sistema |

### Matriz de Permisos

| Acción | Student | Editor Teacher | Executor Teacher | Admin |
|--------|---------|----------------|------------------|-------|
| Ver contenido | ✅ | ✅ | ✅ | ✅ |
| Completar ejercicios | ✅ | ✅ | ✅ | ✅ |
| Editar cursos | ❌ | ✅ | ❌ | ✅ |
| Ver estudiantes | ❌ | ❌ | ✅ | ✅ |
| Aprobar usuarios | ❌ | ❌ | ❌ | ✅ |
| Gestionar sistema | ❌ | ❌ | ❌ | ✅ |

---

##  Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor con nodemon (hot-reload)

# Producción
npm start               # Inicia servidor en modo producción

# Prisma
npm run prisma:generate # Genera cliente de Prisma
npm run prisma:migrate  # Ejecuta migraciones
npm run prisma:studio   # Abre interfaz visual de BD

# Base de datos
npm run seed            # Crea administrador inicial

# Testing
npm test                # Ejecuta tests (pendiente configurar)

# Linting
npm run lint            # Verifica código (pendiente configurar)
```

---

##  Guía de Uso

### Para Desarrolladores Frontend

1. **Registrar un usuario de prueba:**
   - POST a `/api/auth/register`
   - El usuario queda pendiente

2. **Login como admin:**
   - POST a `/api/auth/login` con credenciales del admin
   - Guarda el token recibido

3. **Aprobar el usuario:**
   - GET a `/api/auth/users/pending` (con token)
   - PUT a `/api/auth/users/:id/approve` con roleId

4. **Login con usuario aprobado:**
   - POST a `/api/auth/login`
   - Usa el token para acceder a rutas protegidas

### Almacenar Token en Frontend

```javascript
// Después del login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
}
```

### Usar Token en Requests

```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

##  Troubleshooting

### Error: "Cannot connect to PostgreSQL"

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql  # Linux
brew services list  # Mac
# Windows: Services → PostgreSQL

# Si no está corriendo, iniciarlo
sudo systemctl start postgresql  # Linux
brew services start postgresql  # Mac
```

### Error: "JWT_SECRET not defined"

**Solución:**
```bash
# Verificar que .env exista
ls -la .env

# Agregar JWT_SECRET
echo 'JWT_SECRET="mi_secreto_seguro"' >> .env
```

### Error: "Email ya está registrado"

**Solución:**
- Usa otro email
- O elimina el usuario existente desde Prisma Studio

```bash
npm run prisma:studio
# Navegar a tabla "users" → Delete
```

### Usuario no puede hacer login

**Posibles causas:**
1. **No está aprobado** → Admin debe aprobar
2. **Contraseña incorrecta** → Verificar typos
3. **Usuario desactivado** → Contactar admin

---

##  Seguridad

### Producción

Antes de desplegar a producción:

1. **Cambiar JWT_SECRET:**
   ```bash
   # Generar secreto aleatorio
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Cambiar contraseña del admin**

3. **Usar HTTPS** (no HTTP)

4. **Configurar CORS** correctamente:
   ```javascript
   cors({
     origin: 'https://tu-dominio.com',
     credentials: true
   })
   ```

5. **Variables de entorno seguras:**
   - Nunca commitear `.env`
   - Usar servicios como AWS Secrets Manager

---

##  Contribución

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

---

##  Equipo TAMARINDO

- **Backend:** Josue Garcia
- **Frontend:** Milena Torrico, Florencia Ramos, Melina Montaño
- **Database:** PostgreSQL + Prisma

---

## Soporte

¿Necesitas ayuda? Contacta:
- Email: josueg4rcia@gmail.com
- Issues: GitHub Issues
- Documentación: [Link a docs]

---