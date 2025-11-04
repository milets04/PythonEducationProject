// src/routes/topicRoutes.js
// Rutas para gestión de tópicos

import express from 'express'
import {
  create,
  getById,
  getByUnit,
  update,
  remove
} from '../controllers/topicController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { editorTeacherMiddleware } from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN Y ROL DE EDITOR TEACHER
 */

// POST /api/topics
// Crear un nuevo tópico
router.post('/', authMiddleware, editorTeacherMiddleware, create)

// GET /api/topics/:id
// Obtener un tópico específico
router.get('/:id', authMiddleware, getById)

// GET /api/topics/unit/:unitId
// Obtener todos los tópicos de una unidad
router.get('/unit/:unitId', authMiddleware, getByUnit)

// PUT /api/topics/:id
// Actualizar un tópico
router.put('/:id', authMiddleware, editorTeacherMiddleware, update)

// DELETE /api/topics/:id
// Eliminar un tópico
router.delete('/:id', authMiddleware, editorTeacherMiddleware, remove)

export default router
