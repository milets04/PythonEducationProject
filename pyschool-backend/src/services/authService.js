// src/services/authService.js
// Contiene la lógica de negocios para autenticación
// La capa Service es donde va la lógica principal, separada de los endpoints

import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { generateToken } from '../utils/tokenUtils.js'

const prisma = new PrismaClient()

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - {firstName, lastName, email, password, roleId}
 * @returns {Object} - Datos del usuario creado con token
 */
export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, roleId } = userData

  // Validar que el email no exista
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  // Validar que el roleId sea válido
  const roleExists = await prisma.role.findUnique({
    where: { id: roleId }
  })

  if (!roleExists) {
    throw new Error('El rol especificado no existe')
  }

  // Hashear la contraseña
  const passwordHash = await hashPassword(password)

  // Crear el usuario
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      roleId
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
  if (roleId === 2 || roleId === 3) {
    // Si es editorTeacher (2) o executorTeacher (3)
    await prisma.teacher.create({
      data: {
        userId: user.id
      }
    })
  } else if (roleId === 1) {
    // Si es student (1)
    await prisma.student.create({
      data: {
        userId: user.id
      }
    })
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
 * Inicia sesión validando email y contraseña
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
      role: true,
      createdAt: true
    }
  })

  return users
}
