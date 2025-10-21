// src/controllers/authController.js
// Maneja las peticiones HTTP para autenticación
// Es la capa que conecta las rutas con los servicios

import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers
} from '../services/authService.js'

/**
 * Controlador para registro de nuevos usuarios
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm, roleId } = req.body

    // Validaciones básicas
    if (!firstName || !lastName || !email || !password || !passwordConfirm || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      })
    }

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      })
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email es inválido'
      })
    }

    // Llamar al servicio
    const result = await registerUser({
      firstName,
      lastName,
      email,
      password,
      roleId: parseInt(roleId)
    })

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al registrar el usuario'
    })
  }
}

/**
 * Controlador para login de usuarios
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      })
    }

    // Llamar al servicio
    const result = await loginUser(email, password)

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(401).json({
      success: false,
      message: error.message || 'Error al iniciar sesión'
    })
  }
}

/**
 * Controlador para logout
 * POST /api/auth/logout
 * Este es principalmente un endpoint para que el frontend sepa que debe
 * limpiar el token almacenado localmente
 */
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente. Elimina el token del lado del cliente.'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión'
    })
  }
}

/**
 * Controlador para obtener información del usuario autenticado
 * GET /api/auth/me
 * Ruta protegida - requiere autenticación
 */
export const getMe = async (req, res) => {
  try {
    // req.user viene del authMiddleware
    const user = await getCurrentUser(req.user.userId)

    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get me error:', error)
    return res.status(404).json({
      success: false,
      message: error.message || 'Error al obtener información del usuario'
    })
  }
}

/**
 * Controlador para obtener todos los usuarios
 * GET /api/auth/users
 * Ruta protegida - solo administrador
 */
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers()

    return res.status(200).json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Get users error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    })
  }
}
