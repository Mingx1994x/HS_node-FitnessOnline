const handleError = {
  appError: (status, errMessage, next) => {
    const error = new Error(errMessage);
    error.status = status;
    return error
  },
  handleErrorAsync: (func) => {
    return (req, res, next) => {
      func(req, res, next).catch(error => next(error))
    }
  }
}

module.exports = handleError;