// src/services/authService.js
// Contiene la lógica de negocios para autenticación
// La capa Service es donde va la lógica principal, separada de los endpoints

import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { generateToken } from '../utils/tokenUtils.js'

const prisma = new PrismaClient()

/**
 * Registra un nuevo usuario en el sistema
 * NOTA: El usuario queda pendiente de aprobación por el administrador
 * @param {Object} userData - {firstName, lastName, email, password}
 * @returns {Object} - Datos del usuario creado (sin token hasta ser aprobado)
 */
export const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData

  // Validar que el email no exista
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  // Hashear la contraseña
  const passwordHash = await hashPassword(password)

  // Crear el usuario con rol de estudiante por defecto (1)
  // El usuario queda pendiente de aprobación (isApproved: false)
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      roleId: 1, // Por defecto estudiante
      isApproved: false // Pendiente de aprobación
    },
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      isApproved: user.isApproved
    },
    message: 'Usuario registrado. Espera la aprobación del administrador para acceder al sistema.'
  }
}

/**
 * Inicia sesión validando email y contraseña
 * SOLO usuarios aprobados pueden iniciar sesión
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Object} - Datos del usuario y token
 */
export const loginUser = async (email, password) => {
  // Buscar el usuario por email
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!user) {
    throw new Error('Email o contraseña incorrectos')
  }

  // Verificar que el usuario esté activo
  if (!user.isActive) {
    throw new Error('El usuario ha sido desactivado')
  }

  // Verificar que el usuario esté aprobado
  if (!user.isApproved) {
    throw new Error('Tu cuenta aún no ha sido aprobada por el administrador')
  }

  // Comparar la contraseña proporcionada con el hash almacenado
  const passwordMatch = await comparePassword(password, user.passwordHash)

  if (!passwordMatch) {
    throw new Error('Email o contraseña incorrectos')
  }

  // Generar token JWT
  const token = generateToken({
    userId: user.id,
    roleId: user.roleId,
    email: user.email
  })

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name
    },
    token
  }
}

/**
 * Obtiene información del usuario autenticado
 * @param {number} userId - ID del usuario
 * @returns {Object} - Información del usuario
 */
export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      },
      teacher: true,
      student: true,
      userCourses: {
        include: {
          course: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role.name,
    isActive: user.isActive,
    courses: user.userCourses.map(uc => uc.course),
    teacher: user.teacher || null,
    student: user.student || null
  }
}

/**
 * Obtiene todos los usuarios (solo para administrador)
 * @returns {Array} - Lista de usuarios
 */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
      isApproved: true,
      approvedAt: true,
      rejectedAt: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users
}

/**
 * Obtiene usuarios pendientes de aprobación
 * @returns {Array} - Lista de usuarios pendientes
 */
export const getPendingUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      isApproved: false,
      rejectedAt: null
    },
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return users
}

/**
 * Aprueba un usuario y le asigna un rol
 * @param {number} userId - ID del usuario a aprobar
 * @param {number} newRoleId - Nuevo rol a asignar (1-4)
 * @param {number} adminId - ID del administrador que aprueba
 * @returns {Object} - Usuario aprobado
 */
export const approveUser = async (userId, newRoleId, adminId) => {
  // Verificar que el usuario existe y está pendiente
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  if (user.isApproved) {
    throw new Error('El usuario ya está aprobado')
  }

  if (user.rejectedAt) {
    throw new Error('El usuario fue rechazado previamente')
  }

  // Validar que el roleId sea válido
  const roleExists = await prisma.role.findUnique({
    where: { id: newRoleId }
  })

  if (!roleExists) {
    throw new Error('El rol especificado no existe')
  }

  // Aprobar el usuario y actualizar su rol
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isApproved: true,
      roleId: newRoleId,
      approvedAt: new Date(),
      approvedBy: adminId
    },
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // Crear el perfil específico según el rol
  if (newRoleId === 2 || newRoleId === 3) {
    // Si es editorTeacher (2) o executorTeacher (3)
    await prisma.teacher.create({
      data: {
        userId: updatedUser.id
      }
    })
  } else if (newRoleId === 1) {
    // Si es student (1)
    await prisma.student.create({
      data: {
        userId: updatedUser.id
      }
    })
  }

  return {
    id: updatedUser.id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    role: updatedUser.role.name,
    isApproved: updatedUser.isApproved,
    approvedAt: updatedUser.approvedAt
  }
}

/**
 * Rechaza un usuario
 * @param {number} userId - ID del usuario a rechazar
 * @param {number} adminId - ID del administrador que rechaza
 * @returns {Object} - Usuario rechazado
 */
export const rejectUser = async (userId, adminId) => {
  // Verificar que el usuario existe y está pendiente
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  if (user.isApproved) {
    throw new Error('No se puede rechazar un usuario ya aprobado')
  }

  if (user.rejectedAt) {
    throw new Error('El usuario ya fue rechazado')
  }

  // Marcar como rechazado (soft delete)
  const rejectedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      rejectedAt: new Date(),
      rejectedBy: adminId,
      isActive: false
    }
  })

  return {
    id: rejectedUser.id,
    firstName: rejectedUser.firstName,
    lastName: rejectedUser.lastName,
    email: rejectedUser.email,
    rejectedAt: rejectedUser.rejectedAt
  }
}

/**
 * Aprueba múltiples usuarios de una vez
 * @param {Array} approvals - Array de {userId, roleId}
 * @param {number} adminId - ID del administrador
 * @returns {Object} - Resultado de las aprobaciones
 */
export const bulkApproveUsers = async (approvals, adminId) => {
  const results = {
    approved: [],
    failed: []
  }

  for (const approval of approvals) {
    try {
      const approvedUser = await approveUser(approval.userId, approval.roleId, adminId)
      results.approved.push(approvedUser)
    } catch (error) {
      results.failed.push({
        userId: approval.userId,
        error: error.message
      })
    }
  }

  return results
}

/**
 * Rechaza múltiples usuarios de una vez
 * @param {Array} userIds - Array de IDs de usuarios
 * @param {number} adminId - ID del administrador
 * @returns {Object} - Resultado de los rechazos
 */
export const bulkRejectUsers = async (userIds, adminId) => {
  const results = {
    rejected: [],
    failed: []
  }

  for (const userId of userIds) {
    try {
      const rejectedUser = await rejectUser(userId, adminId)
      results.rejected.push(rejectedUser)
    } catch (error) {
      results.failed.push({
        userId,
        error: error.message
      })
    }
  }

  return results
}
