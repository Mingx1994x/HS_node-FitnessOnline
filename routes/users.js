const express = require('express');

const logger = require('../utils/logger')('User');
const { handleErrorAsync } = require('../utils/handleError');
const isAuth = require('../middlewares/isAuth');
const { getUser, putUser, userSignup, userLogin } = require('../controllers/user');

const router = express.Router();

//使用者註冊
router.post('/signup', handleErrorAsync(userSignup));
//使用者登入
router.post('/login', handleErrorAsync(userLogin));
//取得使用者資料
router.get('/profile', isAuth, handleErrorAsync(getUser))
//編輯使用者資料
router.put('/profile', isAuth, handleErrorAsync(putUser))

module.exports = router