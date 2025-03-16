const bcrypt = require('bcrypt');

const { dataSource } = require('../db/data-source');
const { isUndefined, isNotValidUserName, isNotValidEmail, isNotValidUserPassword, isNotValidString } = require('../utils/validate');
const { appError } = require('../utils/handleError');
const { generateJWT } = require('../utils/jwtUtils');

const userRepo = dataSource.getRepository('User');

const userController = {
  getUserProfile: async (req, res, next) => {
    const { id } = req.user;
    if (isNotValidString(id)) {
      return next(appError(400, '欄位未填寫正確'));
    }
    const findUser = await userRepo.findOneBy({
      id
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          email: findUser.email,
          name: findUser.name
        }
      }
    })
  },
  putUserProfile: async (req, res, next) => {
    const { id } = req.user;
    const { name } = req.body;
    if (isNotValidString(id) || isUndefined(name) || isNotValidUserName(name)) {
      return next(appError(400, '欄位未填寫正確'));
    }

    const findUser = await userRepo.findOneBy({ id });
    if (findUser.name === name) {
      return next(appError(400, '使用者名稱未變更'));
    }

    const updateResult = await userRepo.update(
      { id },
      { name }
    );

    if (updateResult.affected === 0) {
      return next(appError(400, '更新使用者失敗'));
    }

    res.status(200).json({
      status: "success",
    })
  },
  putUserPassWord: async (req, res, next) => {
    const { id } = req.user;
    const { password, new_password, confirm_new_password } = req.body;
    if (isNotValidString(password) || isNotValidString(new_password) || isNotValidString(confirm_new_password)) {
      return next(appError(400, '欄位未填寫正確'));
    }

    if (isNotValidUserPassword(password) || isNotValidUserPassword(new_password) || isNotValidUserPassword(confirm_new_password)) {
      return next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'));
    }

    if (new_password !== confirm_new_password) {
      return next(appError(400, '新密碼與驗證新密碼不一致'));
    }

    const findUser = await userRepo.findOne({
      select: ['password'],
      where: { id }
    });
    const isMatch = await bcrypt.compare(password, findUser.password)
    if (!isMatch) {
      return next(appError(400, '密碼輸入錯誤'));
    }

    if (password === new_password) {
      return next(appError(400, '新密碼不能與舊密碼相同'));
    }

    const saltRounds = process.env.SALT_ROUNDS || 10;
    const hashPassword = await bcrypt.hash(new_password, saltRounds);
    const updateResult = await userRepo.update(
      { id },
      { password: hashPassword }
    );

    if (updateResult.affected === 0) {
      return next(appError(400, '更新密碼失敗'));
    }

    res.status(200).json({
      status: "success",
      data: null
    })
  },
  signup: async (req, res, next) => {
    const { name, email, password } = req.body;

    if (isUndefined(name) || isUndefined(email) || isUndefined(password) || isNotValidUserName(name) || isNotValidEmail(email)) {
      return next(appError(400, '欄位未填寫正確'));
    }

    if (isNotValidUserPassword(password)) {
      return next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'));
    }

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
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (isUndefined(email) || isUndefined(password) || isNotValidEmail(email)) {
      return next(appError(400, '欄位未填寫正確'));
    }

    if (isNotValidUserPassword(password)) {
      return next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'));
    }

    const findUser = await userRepo.findOne({
      select: ['id', 'name', 'password', 'role'],
      where: {
        email
      }
    });

    if (!findUser) {
      return next(appError(400, '使用者不存在或密碼輸入錯誤'));
    }

    const isMatch = await bcrypt.compare(password, findUser.password)
    if (!isMatch) {
      return next(appError(400, '使用者不存在或密碼輸入錯誤'));
    }
    //JWT
    const token = generateJWT({
      id: findUser.id,
      role: findUser.role
    });
    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          name: findUser.name
        }
      }
    })
  },
}

module.exports = userController;