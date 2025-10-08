// STANDARIZED RESPONSE FUNCTION

import { createUserService, deleteUserService, getAllUserService, getUserByIdService, updateUserService } from '../models/userModel.js'

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data
  })
}

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body
  try {
    const newUser = await createUserService(name, email, password)
    handleResponse(res, 201, 'User created succesfully', newUser)
  } catch (error) {
    next(error)
  }
}

export const getAllUser = async (req, res, next) => {
  try {
    const users = await getAllUserService()
    handleResponse(res, 200, 'User fetched succesfully', users)
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    if (!user) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User fetched succesfully', user)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  const { name, email, password } = req.body
  try {
    const updatedUser = await updateUserService(req.params.id, name, email, password)
    if (!updatedUser) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User updated succesfully', updatedUser)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id)
    if (!deletedUser) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User deleted  succesfully', deletedUser)
  } catch (error) {
    next(error)
  }
}
