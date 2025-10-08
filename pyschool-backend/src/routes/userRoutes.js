import express from 'express'
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  updateUser
} from '../controllers/userController.js'
import { validateUser, validateUserUpdate } from '../middlewares/inputUserValidator.js'

const router = express.Router()

router.get('/users', getAllUser)
router.get('/users/:id', getUserById)
router.post('/users', validateUser, createUser)
router.put('/users/:id', validateUserUpdate, updateUser)
router.delete('/users/:id', deleteUser)

export default router
