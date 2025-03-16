const { dataSource } = require('../db/data-source');
const { appError, handleErrorAsync } = require('../utils/handleError');
const { verifyJWT } = require('../utils/jwtUtils');

const isAuth = handleErrorAsync(async (req, res, next) => {

  // Authorization: Bearer xxxxxxx.yyyyyyy.zzzzzzz
  // 確認 token 是否存在並取出 token
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(appError(401, '你尚未登入'));
  }

  // 驗證 token
  const token = authorization.split(' ')[1]
  const decoded = await verifyJWT(token);
  // 在資料庫尋找對應 id 的使用者
  const currentUser = await dataSource.getRepository('User').findOne({
    where: {
      id: decoded.id
    }
  })

  if (!currentUser) {
    return next(appError(401, '無效的 token'));
  }

  // 在 req 物件加入 user 欄位
  req.user = currentUser

  next();
})

module.exports = isAuth