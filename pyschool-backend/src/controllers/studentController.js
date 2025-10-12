import {
  createStudentService,
  deleteStudentService,
  getAllStudentsService,
  getStudentByIdService,
  updateStudentService
} from '../models/studentModel.js'

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data
  })
}

export const createStudent = async (req, res, next) => {
  const { nameStudent, lastnameStudent } = req.body
  try {
    const newStudent = await createStudentService(nameStudent, lastnameStudent)
    handleResponse(res, 201, 'Student created successfully', newStudent)
  } catch (error) {
    next(error)
  }
}

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await getAllStudentsService()
    handleResponse(res, 200, 'Students fetched successfully', students)
  } catch (error) {
    next(error)
  }
}

export const getStudentById = async (req, res, next) => {
  try {
    const student = await getStudentByIdService(req.params.id)
    if (!student) return handleResponse(res, 404, 'Student not found')
    handleResponse(res, 200, 'Student fetched successfully', student)
  } catch (error) {
    next(error)
  }
}

export const updateStudent = async (req, res, next) => {
  const { nameStudent, lastnameStudent } = req.body
  try {
    const updatedStudent = await updateStudentService(req.params.id, nameStudent, lastnameStudent)
    if (!updatedStudent) return handleResponse(res, 404, 'Student not found')
    handleResponse(res, 200, 'Student updated successfully', updatedStudent)
  } catch (error) {
    next(error)
  }
}

export const deleteStudent = async (req, res, next) => {
  try {
    const deletedStudent = await deleteStudentService(req.params.id)
    if (!deletedStudent) return handleResponse(res, 404, 'Student not found')
    handleResponse(res, 200, 'Student deleted successfully', deletedStudent)
  } catch (error) {
    next(error)
  }
}
