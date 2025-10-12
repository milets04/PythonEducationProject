import Joi from 'joi'

const teacherScheme = Joi.object({
  nameTeacher: Joi.string().min(2).max(100).required(),
  lastnameTeacher: Joi.string().min(2).max(100).required()
})

const validateTeacher = (req, res, next) => {
  const { error } = teacherScheme.validate(req.body)
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
    })
  }
  next()
}

export default validateTeacher
