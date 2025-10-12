import express from 'express'
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent
} from '../controllers/studentController.js'
import validateStudent from '../middlewares/studentValidator.js'

const router = express.Router()

router.get('/students', getAllStudents)
router.get('/students/:id', getStudentById)
router.post('/students', validateStudent, createStudent)
router.put('/students/:id', validateStudent, updateStudent)
router.delete('/students/:id', deleteStudent)

export default router
