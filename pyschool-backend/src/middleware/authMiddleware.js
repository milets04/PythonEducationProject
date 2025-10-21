// src/middleware/authMiddleware.js
// Middleware para verificar que el usuario esté autenticado
// Se ejecuta antes de llegar al controlador

import { verifyToken, extractTokenFromHeader } from '../utils/tokenUtils.js'

/**
 * Middleware de autenticación
 * Verifica que el token JWT sea válido y lo añade a req.user
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Extraer el token del header Authorization
    const token = extractTokenFromHeader(req.headers.authorization)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Use el formato: Bearer <token>'
      })
    }

    // Verificar y decodificar el token
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      })
    }

    // Adjuntar los datos del token al objeto request
    req.user = decoded
    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en la verificación del token',
      error: error.message
    })
  }
}
