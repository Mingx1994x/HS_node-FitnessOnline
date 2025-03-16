const { handleErrorAsync, appError } = require("../utils/handleError");

const isCoach = handleErrorAsync(async (req, res, next) => {
  if (!req.user || req.user.role !== 'COACH') {
    return next(appError(401, '使用者尚未成為教練'))
  }
  next()
})

module.exports = isCoach