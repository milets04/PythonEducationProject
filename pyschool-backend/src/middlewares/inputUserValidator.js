import Joi from 'joi'

const userScheme = Joi.object({
  nameUser: Joi.string().min(2).max(100).required(),
  lastnameUser: Joi.string().min(2).max(100).required(),
  mailUser: Joi.string().email().max(100).required(),
  passwordUser: Joi.string().min(6).max(100).required(),
  userRole: Joi.string().valid('STUDENT', 'TEACHER_EDITOR', 'TEACHER_EXECUTOR').required(),
  idTeacher: Joi.number().integer().allow(null).optional(),
  idStudent: Joi.number().integer().allow(null).optional()
})

const userUpdateScheme = Joi.object({
  nameUser: Joi.string().min(2).max(100).optional(),
  lastnameUser: Joi.string().min(2).max(100).optional(),
  mailUser: Joi.string().email().max(100).optional(),
  passwordUser: Joi.string().min(6).max(100).optional(),
  userRole: Joi.string().valid('STUDENT', 'TEACHER_EDITOR', 'TEACHER_EXECUTOR').optional(),
  idTeacher: Joi.number().integer().allow(null).optional(),
  idStudent: Joi.number().integer().allow(null).optional(),
  isActive: Joi.boolean().optional()
})

export const validateUser = (req, res, next) => {
  const { error } = userScheme.validate(req.body)
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
    })
  }
  next()
}

export const validateUserUpdate = (req, res, next) => {
  const { error } = userUpdateScheme.validate(req.body)
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
    })
  }
  next()
}

export default validateUser
