import jwt from 'jsonwebtoken'

// Middleware para verificar si el usuario esta autenticado
export const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    // eslint-disable-next-line dot-notation
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'Access token is required'
      })
    }

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: 'Invalid or expired token'
        })
      }

      // Guardar informacion del usuario en el request
      req.user = {
        userId: decoded.userId,
        userRole: decoded.userRole,
        userEmail: decoded.userEmail
      }

      next()
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Error authenticating token'
    })
  }
}

// Middleware para verificar roles especificos
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'User not authenticated'
      })
    }

    if (!allowedRoles.includes(req.user.userRole)) {
      return res.status(403).json({
        status: 403,
        message: 'You do not have permission to access this resource'
      })
    }

    next()
  }
}

// Middleware para verificar si es el mismo usuario o un admin
export const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      message: 'User not authenticated'
    })
  }

  const requestedUserId = parseInt(req.params.id)
  const currentUserId = req.user.userId
  const userRole = req.user.userRole

  // Permitir si es el mismo usuario o si es un TEACHER_EDITOR (admin)
  if (currentUserId === requestedUserId || userRole === 'TEACHER_EDITOR') {
    return next()
  }

  return res.status(403).json({
    status: 403,
    message: 'You can only access your own resources'
  })
}
