import express from 'express'
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher
} from '../controllers/teacherController.js'
import validateTeacher from '../middlewares/teacherValidator.js'
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Solo usuarios autenticados pueden ver teachers
router.get('/teachers', authenticateToken, getAllTeachers)
router.get('/teachers/:id', authenticateToken, getTeacherById)

// Solo TEACHER_EDITOR puede crear, actualizar y eliminar
router.post('/teachers', authenticateToken, authorizeRoles('TEACHER_EDITOR'), validateTeacher, createTeacher)
router.put('/teachers/:id', authenticateToken, authorizeRoles('TEACHER_EDITOR'), validateTeacher, updateTeacher)
router.delete('/teachers/:id', authenticateToken, authorizeRoles('TEACHER_EDITOR'), deleteTeacher)

export default router
