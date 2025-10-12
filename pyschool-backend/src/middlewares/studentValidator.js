import Joi from 'joi'

const studentScheme = Joi.object({
  nameStudent: Joi.string().min(2).max(100).required(),
  lastnameStudent: Joi.string().min(2).max(100).required()
})

const validateStudent = (req, res, next) => {
  const { error } = studentScheme.validate(req.body)
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
    })
  }
  next()
}

export default validateStudent
