import Joi from 'joi'

const loginScheme = Joi.object({
  mailUser: Joi.string().email().required(),
  passwordUser: Joi.string().min(6).required()
})

const validateLogin = (req, res, next) => {
  const { error } = loginScheme.validate(req.body)
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
    })
  }
  next()
}

export default validateLogin
