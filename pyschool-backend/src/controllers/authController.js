// src/controllers/authController.js
// Maneja las peticiones HTTP para autenticación
// Es la capa que conecta las rutas con los servicios

import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  bulkApproveUsers,
  bulkRejectUsers
} from '../services/authService.js'

/**
 * Controlador para registro de nuevos usuarios
 * POST /api/auth/register
 * NOTA: El usuario queda pendiente de aprobación
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body

    // Validaciones básicas
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'The passwords do not match'
      })
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'The password must be at least 6 characters long'
      })
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'The email format is invalid.'
      })
    }

    // Llamar al servicio (sin roleId, por defecto será estudiante)
    const result = await registerUser({
      firstName,
      lastName,
      email,
      password
    })

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.user
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error registering user'
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
        message: 'Email and password are required'
      })
    }

    // Llamar al servicio
    const result = await loginUser(email, password)

    return res.status(200).json({
      success: true,
      message: 'Successful login',
      data: result
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(401).json({
      success: false,
      message: error.message || 'Login error'
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
      message: 'Session successfully closed. Removes the token from the client side.'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({
      success: false,
      message: 'Logout error'
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
      message: error.message || 'Error retrieving user information'
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
      message: 'Error getting users'
    })
  }
}

/**
 * Controlador para obtener usuarios pendientes de aprobación
 * GET /api/auth/users/pending
 * Ruta protegida - solo administrador
 */
export const getPending = async (req, res) => {
  try {
    const pendingUsers = await getPendingUsers()

    return res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    })
  } catch (error) {
    console.error('Get pending users error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error retrieving pending users'
    })
  }
}

/**
 * Controlador para aprobar un usuario
 * PUT /api/auth/users/:id/approve
 * Ruta protegida - solo administrador
 */
export const approveUserController = async (req, res) => {
  try {
    const { id } = req.params
    const { roleId } = req.body
    const adminId = req.user.userId

    // Validaciones
    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: 'The roleId is required'
      })
    }

    const validRoles = [1, 2, 3, 4]
    if (!validRoles.includes(parseInt(roleId))) {
      return res.status(400).json({
        success: false,
        message: 'The roleId must be 1 (student), 2 (editing professor), 3 (executing professor) or 4 (administrator)'
      })
    }

    const approvedUser = await approveUser(parseInt(id), parseInt(roleId), adminId)

    return res.status(200).json({
      success: true,
      message: 'Successfully approved user',
      data: approvedUser
    })
  } catch (error) {
    console.error('Approve user error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error approving user'
    })
  }
}

/**
 * Controlador para rechazar un usuario
 * PUT /api/auth/users/:id/reject
 * Ruta protegida - solo administrador
 */
export const rejectUserController = async (req, res) => {
  try {
    const { id } = req.params
    const adminId = req.user.userId

    const rejectedUser = await rejectUser(parseInt(id), adminId)

    return res.status(200).json({
      success: true,
      message: 'User successfully rejected',
      data: rejectedUser
    })
  } catch (error) {
    console.error('Reject user error:', error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Error rejecting user'
    })
  }
}

/**
 * Controlador para aprobar múltiples usuarios
 * POST /api/auth/users/bulk-approve
 * Body: { approvals: [{userId: 1, roleId: 2}, {userId: 2, roleId: 1}] }
 * Ruta protegida - solo administrador
 */
export const bulkApproveController = async (req, res) => {
  try {
    const { approvals } = req.body
    const adminId = req.user.userId

    if (!Array.isArray(approvals) || approvals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The approval array is mandatory and cannot be empty.'
      })
    }

    const results = await bulkApproveUsers(approvals, adminId)

    return res.status(200).json({
      success: true,
      message: `${results.approved.length} approved users, ${results.failed.length} failed`,
      data: results
    })
  } catch (error) {
    console.error('Bulk approve error:', error)
    return res.status(400).json({
      success: false,
      message: 'Error approving users'
    })
  }
}

/**
 * Controlador para rechazar múltiples usuarios
 * POST /api/auth/users/bulk-reject
 * Body: { userIds: [1, 2, 3] }
 * Ruta protegida - solo administrador
 */
export const bulkRejectController = async (req, res) => {
  try {
    const { userIds } = req.body
    const adminId = req.user.userId

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The userIds array is required and cannot be empty.'
      })
    }

    const results = await bulkRejectUsers(userIds, adminId)

    return res.status(200).json({
      success: true,
      message: `${results.rejected.length} rejected users, ${results.failed.length} failed`,
      data: results
    })
  } catch (error) {
    console.error('Bulk reject error:', error)
    return res.status(400).json({
      success: false,
      message: 'Error rejecting users'
    })
  }
}
