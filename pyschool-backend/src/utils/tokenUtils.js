import jwt from 'jsonwebtoken'
import { config } from '../config/environment.js'

// GENERAR token
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire
  })
}

// VERIFICAR token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret)
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return null
  }
}

// EXTRAER token del header
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  return parts[0] === 'Bearer' ? parts[1] : null
}
