// src/middleware/roleMiddleware.js
// Middleware para verificar roles específicos
// Se ejecuta después de authMiddleware

/**
 * Factory function que crea un middleware verificador de roles
 * Uso: roleMiddleware([1, 2, 3]) solo permite roles con esos IDs
 * @param {Array<number>} allowedRoles - Array de roleIds permitidos
 * @returns {Function} - Middleware que verifica el rol
 */
export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // El authMiddleware debe ejecutarse primero
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated user'
      })
    }

    // Verificar si el roleId del usuario está en los permitidos
    if (!allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      })
    }

    next()
  }
}

/**
 * Middleware específico para administrador
 */
export const adminMiddleware = roleMiddleware([4])

/**
 * Middleware específico para profesores (editor y executor)
 */
export const teacherMiddleware = roleMiddleware([2, 3])

/**
 * Middleware específico para profesor editor
 */
export const editorTeacherMiddleware = roleMiddleware([2])

/**
 * Middleware específico para profesor executor
 */
export const executorTeacherMiddleware = roleMiddleware([3])

/**
 * Middleware específico para estudiantes
 */
export const studentMiddleware = roleMiddleware([1])

/**
 * Middleware para estudiantes y profesores
 */
export const studentOrTeacherMiddleware = roleMiddleware([1, 2, 3])
