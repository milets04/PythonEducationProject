import {
  createTeacherService,
  deleteTeacherService,
  getAllTeachersService,
  getTeacherByIdService,
  updateTeacherService
} from '../models/teacherModel.js'

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data
  })
}

export const createTeacher = async (req, res, next) => {
  const { nameTeacher, lastnameTeacher } = req.body
  try {
    const newTeacher = await createTeacherService(nameTeacher, lastnameTeacher)
    handleResponse(res, 201, 'Teacher created successfully', newTeacher)
  } catch (error) {
    next(error)
  }
}

export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await getAllTeachersService()
    handleResponse(res, 200, 'Teachers fetched successfully', teachers)
  } catch (error) {
    next(error)
  }
}

export const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await getTeacherByIdService(req.params.id)
    if (!teacher) return handleResponse(res, 404, 'Teacher not found')
    handleResponse(res, 200, 'Teacher fetched successfully', teacher)
  } catch (error) {
    next(error)
  }
}

export const updateTeacher = async (req, res, next) => {
  const { nameTeacher, lastnameTeacher } = req.body
  try {
    const updatedTeacher = await updateTeacherService(req.params.id, nameTeacher, lastnameTeacher)
    if (!updatedTeacher) return handleResponse(res, 404, 'Teacher not found')
    handleResponse(res, 200, 'Teacher updated successfully', updatedTeacher)
  } catch (error) {
    next(error)
  }
}

export const deleteTeacher = async (req, res, next) => {
  try {
    const deletedTeacher = await deleteTeacherService(req.params.id)
    if (!deletedTeacher) return handleResponse(res, 404, 'Teacher not found')
    handleResponse(res, 200, 'Teacher deleted successfully', deletedTeacher)
  } catch (error) {
    next(error)
  }
}
