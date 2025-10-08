import express from 'express'
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher
} from '../controllers/teacherController.js'
import validateTeacher from '../middlewares/teacherValidator.js'

const router = express.Router()

router.get('/teachers', getAllTeachers)
router.get('/teachers/:id', getTeacherById)
router.post('/teachers', validateTeacher, createTeacher)
router.put('/teachers/:id', validateTeacher, updateTeacher)
router.delete('/teachers/:id', deleteTeacher)

export default router
