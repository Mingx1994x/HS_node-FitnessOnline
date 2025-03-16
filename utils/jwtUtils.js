const jwt = require('jsonwebtoken');
const config = require('../config/index');
const { appError } = require('./handleError');

const generateJWT = (payload) => {
  // 產生 JWT token
  return jwt.sign(
    payload,
    config.get('jwtConfig.jwtSecret'),
    { expiresIn: config.get('jwtConfig.jwtExpiresDay') }
  );
}

const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('jwtConfig.jwtSecret'), (err, decoded) => {
      if (err) {
        switch (err.name) {
          case 'TokenExpiredError':
            reject(appError(401, 'Token 已過期'))
            break
          default:
            reject(appError(401, '無效的 token'))
            break
        }
      } else {
        resolve(decoded)
      }
    })
  })
}

module.exports = {
  generateJWT,
};
