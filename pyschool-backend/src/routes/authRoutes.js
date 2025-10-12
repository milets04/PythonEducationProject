import express from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile
} from '../controllers/authController.js'
import { validateUser } from '../middlewares/inputUserValidator.js'
import validateLogin from '../middlewares/loginValidator.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Rutas publicas (no requieren autenticacion)
router.post('/auth/register', validateUser, register)
router.post('/auth/login', validateLogin, login)
router.post('/auth/refresh', refreshToken)

// Rutas protegidas (requieren autenticacion)
router.post('/auth/logout', authenticateToken, logout)
router.get('/auth/profile', authenticateToken, getProfile)

export default router
