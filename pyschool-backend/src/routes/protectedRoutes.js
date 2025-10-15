// src/routes/protectedRoutes.js
// Rutas de ejemplo protegidas por rol para demostrar el sistema

import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import {
  adminMiddleware,
  teacherMiddleware,
  editorTeacherMiddleware,
  executorTeacherMiddleware,
  studentMiddleware,
  studentOrTeacherMiddleware
} from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * RUTAS PARA ESTUDIANTES
 */
router.get('/student/dashboard', authMiddleware, studentMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al dashboard de estudiante',
    userId: req.user.userId,
    roleId: req.user.roleId
  })
})

/**
 * RUTAS PARA PROFESORES (Editor y Executor)
 */
router.get('/teacher/dashboard', authMiddleware, teacherMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al dashboard de profesor',
    userId: req.user.userId,
    roleId: req.user.roleId
  })
})

/**
 * RUTAS PARA PROFESOR EDITOR
 * Puede ver y editar contenidos
 */
router.get('/teacher/editor/courses', authMiddleware, editorTeacherMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Acceso a edición de cursos',
    userId: req.user.userId
  })
})

/**
 * RUTAS PARA PROFESOR EXECUTOR
 * Puede ver estudiantes y hacer seguimiento
 */
router.get('/teacher/executor/students', authMiddleware, executorTeacherMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Acceso a seguimiento de estudiantes',
    userId: req.user.userId
  })
})

/**
 * RUTAS PARA ADMINISTRADOR
 */
router.get('/admin/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al dashboard administrativo',
    userId: req.user.userId
  })
})

/**
 * RUTAS PARA ESTUDIANTES O PROFESORES
 */
router.get('/content/view', authMiddleware, studentOrTeacherMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Acceso a visualizar contenido',
    userId: req.user.userId
  })
})

export default router
