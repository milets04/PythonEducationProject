import express from 'express'
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  updateUser
} from '../controllers/userController.js'
import { validateUser, validateUserUpdate } from '../middlewares/inputUserValidator.js'
import { authenticateToken, authorizeRoles, authorizeOwnerOrAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Rutas protegidas - Solo TEACHER_EDITOR puede acceder
// router.get('/users', authenticateToken, authorizeRoles('TEACHER_EDITOR'), getAllUser)
router.get('/users', getAllUser)
// router.post('/users', authenticateToken, authorizeRoles('TEACHER_EDITOR'), validateUser, createUser)
router.post('/users', validateUser, createUser)

// Rutas protegidas - Usuario puede ver su propio perfil o TEACHER_EDITOR puede ver cualquiera
// router.get('/users/:id', authenticateToken, authorizeOwnerOrAdmin, getUserById)
router.get('/users/:id', getUserById)

// Rutas protegidas - Usuario puede actualizar su propio perfil o TEACHER_EDITOR puede actualizar cualquiera
router.put('/users/:id', authenticateToken, authorizeOwnerOrAdmin, validateUserUpdate, updateUser)

// Rutas protegidas - Solo TEACHER_EDITOR puede eliminar
router.delete('/users/:id', authenticateToken, authorizeRoles('TEACHER_EDITOR'), deleteUser)

export default router
