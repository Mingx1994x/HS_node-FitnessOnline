const express = require('express');
const bcrypt = require('bcrypt');


const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('User');

const { isUndefined, isNotValidUserName, isNotValidEmail, isNotValidUserPassword } = require('../utils/validate');
// const appError = require('../utils/appError');
const { appError, handleErrorAsync } = require('../utils/handleError');

const router = express.Router();
router.post('/signup', handleErrorAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (isUndefined(name) || isUndefined(email) || isUndefined(password) || isNotValidUserName(name) || isNotValidEmail(email)) {
    return next(appError(400, '欄位未填寫正確'));
  }

  if (isNotValidUserPassword(password)) {
    return next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'));
  }

  const userRepo = dataSource.getRepository('User');
  const existUser = userRepo.find({
    where: {
      email
    }
  });

  if ((await existUser).length > 0) {
    return next(appError(409, 'Email已被使用'));
  }

  const saltRounds = process.env.SALT_ROUNDS || 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  const newUser = userRepo.create({
    name,
    email,
    role: 'USER',
    password: hashPassword
  });
  const result = await userRepo.save(newUser);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: result.id,
        name: result.name
      }
    }
  })
}))


module.exports = router