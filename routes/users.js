const express = require('express');
const bcrypt = require('bcrypt');


const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('User');

const { isUndefined, isNotValidUserName, isNotValidEmail, isNotValidUserPassword } = require('../utils/validate');

const router = express.Router();
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (isUndefined(name) || isUndefined(email) || isUndefined(password) || isNotValidUserName(name) || isNotValidEmail(email)) {
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    if (isNotValidUserPassword(password)) {
      res.status(400).json({
        status: 'failed',
        message: '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'
      })
      return
    }

    const userRepo = dataSource.getRepository('User');
    const existUser = userRepo.find({
      where: {
        email
      }
    });

    if ((await existUser).length > 0) {
      res.status(409).json({
        status: 'failed',
        message: 'Email已被使用'
      })
      return
    }

    const saltRounds = await bcrypt.genSalt(10);
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
  } catch (error) {
    next(error);
  }
})


module.exports = router