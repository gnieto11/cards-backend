class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err
  res.status(statusCode).json({
    status: statusCode,
    message: message
  })
}

module.exports = {
  ErrorHandler,
  handleError
}