// src/app.js
// Configuración principal de Express y middleware global

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.js'
import protectedRoutes from './routes/protectedRoutes.js'

const app = express()

/**
 * MIDDLEWARE GLOBAL DE SEGURIDAD Y PARSEO
 */

// Helmet ayuda a asegurar la aplicación estableciendo headers HTTP
app.use(helmet())

// CORS permite peticiones desde diferentes dominios
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

// Body parser - convierte JSON en objetos JavaScript
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * RUTAS
 */

// Rutas de autenticación
app.use('/api/auth', authRoutes)

// Rutas protegidas de ejemplo
app.use('/api/protected', protectedRoutes)

/**
 * RUTA DE PRUEBA
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  })
})

/**
 * MANEJO DE RUTAS NO ENCONTRADAS
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`
  })
})

/**
 * MANEJO GLOBAL DE ERRORES
 */
app.use((err, req, res, next) => {
  console.error('Error global:', err)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

export default app
