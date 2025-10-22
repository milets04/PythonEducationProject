// src/routes/authRoutes.js
// Define todas las rutas de autenticación

import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  getUsers,
  getPending,
  approveUserController,
  rejectUserController,
  bulkApproveController,
  bulkRejectController
} from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { adminMiddleware } from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * RUTAS PÚBLICAS (sin autenticación requerida)
 */

// POST /api/auth/register
// Registrar un nuevo usuario (queda pendiente de aprobación)
router.post('/register', register)

// POST /api/auth/login
// Iniciar sesión (solo usuarios aprobados)
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

/**
 * RUTAS DE ADMINISTRACIÓN (solo administrador)
 */

// GET /api/auth/users
// Obtener todos los usuarios
router.get('/users', authMiddleware, adminMiddleware, getUsers)

// GET /api/auth/users/pending
// Obtener usuarios pendientes de aprobación
router.get('/users/pending', authMiddleware, adminMiddleware, getPending)

// PUT /api/auth/users/:id/approve
// Aprobar un usuario y asignarle rol
router.put('/users/:id/approve', authMiddleware, adminMiddleware, approveUserController)

// PUT /api/auth/users/:id/reject
// Rechazar un usuario
router.put('/users/:id/reject', authMiddleware, adminMiddleware, rejectUserController)

// POST /api/auth/users/bulk-approve
// Aprobar múltiples usuarios
router.post('/users/bulk-approve', authMiddleware, adminMiddleware, bulkApproveController)

// POST /api/auth/users/bulk-reject
// Rechazar múltiples usuarios
router.post('/users/bulk-reject', authMiddleware, adminMiddleware, bulkRejectController)

export default router
