import express from 'express'
import { createUser, deleteUser, getAllUser, getUserById, updateUser } from '../controllers/userController.js'
import validateUser from '../middlewares/inputVUserValidator.js'

const router = express.Router()

router.get('/user', getAllUser)
router.get('/user/:id', getUserById)
router.post('/user/', validateUser, createUser)
router.delete('/user/:id', deleteUser)
router.put('/user/:id',validateUser, updateUser)

export default router
