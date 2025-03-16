const express = require('express');

const logger = require('../utils/logger')('User');
const { handleErrorAsync } = require('../utils/handleError');
const isAuth = require('../middlewares/isAuth');
const { login, signup, putUserPassWord, putUserProfile, getUserProfile } = require('../controllers/user')
const router = express.Router();
//使用者註冊
router.post('/signup', handleErrorAsync(signup));
//使用者登入
router.post('/login', handleErrorAsync(login));
//取得使用者資料
router.get('/profile', isAuth, handleErrorAsync(getUserProfile))
//編輯使用者資料
router.put('/profile', isAuth, handleErrorAsync(putUserProfile))
//使用者更新密碼
router.put('/password', isAuth, handleErrorAsync(putUserPassWord))

module.exports = router