import jwt from 'jsonwebtoken'
import {
  createUserService,
  getUserByEmailService,
  verifyPasswordService,
  updateLastLoginService
} from '../models/userModel.js'

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data
  })
}

// Funcion para generar JWT
const generateToken = (userId, userRole, userEmail) => {
  return jwt.sign(
    {
      userId,
      userRole,
      userEmail
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
}

// Funcion para generar Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )
}

// REGISTRO DE USUARIO
export const register = async (req, res, next) => {
  const { nameUser, lastnameUser, mailUser, passwordUser, userRole, idTeacher, idStudent } = req.body

  try {
    // Verificar si el email ya existe
    const existingUser = await getUserByEmailService(mailUser)
    if (existingUser) {
      return handleResponse(res, 409, 'Email already registered')
    }

    // Validar coherencia entre rol y referencias
    if (userRole === 'STUDENT' && !idStudent) {
      return handleResponse(res, 400, 'Student role requires idStudent')
    }

    if ((userRole === 'TEACHER_EDITOR' || userRole === 'TEACHER_EXECUTOR') && !idTeacher) {
      return handleResponse(res, 400, 'Teacher role requires idTeacher')
    }

    const userData = {
      nameUser,
      lastnameUser,
      mailUser,
      passwordUser,
      userRole,
      idTeacher: idTeacher || null,
      idStudent: idStudent || null
    }

    // Crear usuario (la contraseña se encripta en el modelo)
    const newUser = await createUserService(userData)

    // Generar tokens
    const token = generateToken(newUser.idUser, newUser.userRole, newUser.mailUser)
    const refreshToken = generateRefreshToken(newUser.idUser)

    // Enviar refresh token en cookie httpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    })

    handleResponse(res, 201, 'User registered successfully', {
      user: {
        idUser: newUser.idUser,
        nameUser: newUser.nameUser,
        lastnameUser: newUser.lastnameUser,
        mailUser: newUser.mailUser,
        userRole: newUser.userRole,
        isActive: newUser.isActive
      },
      token
    })
  } catch (error) {
    next(error)
  }
}

// LOGIN DE USUARIO
export const login = async (req, res, next) => {
  const { mailUser, passwordUser } = req.body

  try {
    // Validar que se proporcionen email y password
    if (!mailUser || !passwordUser) {
      return handleResponse(res, 400, 'Email and password are required')
    }

    // Buscar usuario por email
    const user = await getUserByEmailService(mailUser)
    if (!user) {
      return handleResponse(res, 401, 'Invalid credentials')
    }

    // Verificar si el usuario esta activo
    if (!user.isActive) {
      return handleResponse(res, 403, 'User account is inactive')
    }

    // Verificar contraseña
    const isValidPassword = await verifyPasswordService(passwordUser, user.passwordUser)
    if (!isValidPassword) {
      return handleResponse(res, 401, 'Invalid credentials')
    }

    // Actualizar ultimo login
    await updateLastLoginService(user.idUser)

    // Generar tokens
    const token = generateToken(user.idUser, user.userRole, user.mailUser)
    const refreshToken = generateRefreshToken(user.idUser)

    // Enviar refresh token en cookie httpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    })

    handleResponse(res, 200, 'Login successful', {
      user: {
        idUser: user.idUser,
        nameUser: user.nameUser,
        lastnameUser: user.lastnameUser,
        mailUser: user.mailUser,
        userRole: user.userRole,
        isActive: user.isActive,
        lastLogin: new Date()
      },
      token
    })
  } catch (error) {
    next(error)
  }
}

// LOGOUT DE USUARIO
export const logout = async (req, res, next) => {
  try {
    // Limpiar cookie del refresh token
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    handleResponse(res, 200, 'Logout successful')
  } catch (error) {
    next(error)
  }
}

// REFRESH TOKEN - Renovar el token de acceso
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      return handleResponse(res, 401, 'Refresh token not found')
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)

    // Buscar usuario
    const user = await getUserByEmailService(decoded.userEmail)
    if (!user || !user.isActive) {
      return handleResponse(res, 401, 'Invalid refresh token')
    }

    // Generar nuevo access token
    const newToken = generateToken(user.idUser, user.userRole, user.mailUser)

    handleResponse(res, 200, 'Token refreshed successfully', {
      token: newToken
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return handleResponse(res, 401, 'Invalid or expired refresh token')
    }
    next(error)
  }
}

// OBTENER PERFIL DEL USUARIO AUTENTICADO
export const getProfile = async (req, res, next) => {
  try {
    // El usuario ya esta disponible en req.user gracias al middleware de autenticacion
    const user = await getUserByEmailService(req.user.userEmail)

    if (!user) {
      return handleResponse(res, 404, 'User not found')
    }

    handleResponse(res, 200, 'Profile fetched successfully', {
      idUser: user.idUser,
      nameUser: user.nameUser,
      lastnameUser: user.lastnameUser,
      mailUser: user.mailUser,
      userRole: user.userRole,
      idTeacher: user.idTeacher,
      idStudent: user.idStudent,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    })
  } catch (error) {
    next(error)
  }
}
