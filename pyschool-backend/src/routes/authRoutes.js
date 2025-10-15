// src/routes/authRoutes.js
// Define todas las rutas de autenticación

import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  getUsers
} from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { adminMiddleware } from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * RUTAS PÚBLICAS (sin autenticación requerida)
 */

// POST /api/auth/register
// Registrar un nuevo usuario
router.post('/register', register)

// POST /api/auth/login
// Iniciar sesión
router.post('/login', login)

/**
 * RUTAS PROTEGIDAS (requieren autenticación)
 */

// POST /api/auth/logout
// Cerrar sesión
router.post('/logout', authMiddleware, logout)

// GET /api/auth/me
// Obtener información del usuario autenticado
router.get('/me', authMiddleware, getMe)

// GET /api/auth/users
// Obtener todos los usuarios (solo administrador)
router.get('/users', authMiddleware, adminMiddleware, getUsers)

export default router
