// CERNALIZED ERROR HANDLER
const errorHandling = (error, req, res, next) => {
  console.log(error.stack)
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: error.message
  })
}

export default errorHandling
