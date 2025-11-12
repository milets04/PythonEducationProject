// src/routes/topicRoutes.js
// Rutas para gestión de tópicos y versiones

import express from 'express'
import {
  create,
  getById,
  getByUnit,
  update,
  remove,
  getVersionHistory,
  getSpecificVersion,
  restoreVersion,
  compareVersions,
} from '../controllers/topicController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { editorTeacherMiddleware } from '../middleware/roleMiddleware.js'

const router = express.Router()

/**
 * RUTAS DE TÓPICOS
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

/**
 * RUTAS DE VERSIONES
 */

// GET /api/topics/:id/versions
// Obtener historial de versiones
router.get('/:id/versions', authMiddleware, getVersionHistory)

// GET /api/topics/:id/versions/compare
// Comparar dos versiones (query params: v1, v2)
router.get('/:id/versions/compare', authMiddleware, compareVersions)

// GET /api/topics/:id/versions/:versionNumber
// Obtener una versión específica
router.get('/:id/versions/:versionNumber', authMiddleware, getSpecificVersion)

// POST /api/topics/:id/versions/:versionNumber/restore
// Restaurar una versión anterior (solo editor teacher)
router.post('/:id/versions/:versionNumber/restore', authMiddleware, editorTeacherMiddleware, restoreVersion)

export default router