import express from 'express'
import {
  create,
  getById,
  getByCourse,
  update,
  remove,
  reorder
} from '../controllers/unitController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { editorTeacherMiddleware } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, editorTeacherMiddleware, create)
router.get('/:id', authMiddleware, getById)
router.get('/course/:courseId', authMiddleware, getByCourse)
router.put('/:id', authMiddleware, editorTeacherMiddleware, update)
router.delete('/:id', authMiddleware, editorTeacherMiddleware, remove)
router.put('/course/:courseId/reorder', authMiddleware, editorTeacherMiddleware, reorder)

export default router
