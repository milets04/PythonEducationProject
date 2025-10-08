import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService,
  getUserByEmailService
} from '../models/userModel.js'

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data
  })
}

export const createUser = async (req, res, next) => {
  const { nameUser, lastnameUser, mailUser, passwordUser, userRole, idTeacher, idStudent } = req.body

  try {
    // Verificar si el email ya existe
    const existingUser = await getUserByEmailService(mailUser)
    if (existingUser) {
      return handleResponse(res, 409, 'Email already registered')
    }

    // Validar que idTeacher o idStudent existan segun el rol
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

    const newUser = await createUserService(userData)
    handleResponse(res, 201, 'User created successfully', newUser)
  } catch (error) {
    next(error)
  }
}

export const getAllUser = async (req, res, next) => {
  try {
    const users = await getAllUserService()
    handleResponse(res, 200, 'Users fetched successfully', users)
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    if (!user) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User fetched successfully', user)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  const { nameUser, lastnameUser, mailUser, passwordUser, userRole, idTeacher, idStudent, isActive } = req.body

  try {
    // Verificar si el usuario existe
    const existingUser = await getUserByIdService(req.params.id)
    if (!existingUser) return handleResponse(res, 404, 'User not found')

    // Si se cambia el email, verificar que no este en uso
    if (mailUser && mailUser !== existingUser.mailUser) {
      const emailInUse = await getUserByEmailService(mailUser)
      if (emailInUse) {
        return handleResponse(res, 409, 'Email already in use')
      }
    }

    // Validar coherencia entre rol y referencias
    if (userRole === 'STUDENT' && !idStudent) {
      return handleResponse(res, 400, 'Student role requires idStudent')
    }

    if ((userRole === 'TEACHER_EDITOR' || userRole === 'TEACHER_EXECUTOR') && !idTeacher) {
      return handleResponse(res, 400, 'Teacher role requires idTeacher')
    }

    const userData = {
      nameUser: nameUser || existingUser.nameUser,
      lastnameUser: lastnameUser || existingUser.lastnameUser,
      mailUser: mailUser || existingUser.mailUser,
      passwordUser: passwordUser || null,
      userRole: userRole || existingUser.userRole,
      idTeacher: idTeacher !== undefined ? idTeacher : existingUser.idTeacher,
      idStudent: idStudent !== undefined ? idStudent : existingUser.idStudent,
      isActive: isActive !== undefined ? isActive : existingUser.isActive
    }

    const updatedUser = await updateUserService(req.params.id, userData)
    handleResponse(res, 200, 'User updated successfully', updatedUser)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id)
    if (!deletedUser) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User deleted successfully', deletedUser)
  } catch (error) {
    next(error)
  }
}
