const express = require('express');

const logger = require('../utils/logger')('admin')
const { handleErrorAsync } = require('../utils/handleError');
const isAuth = require('../middlewares/isAuth');
const isCoach = require('../middlewares/isCoach');
const { postCourse, putCourse, registerCoachRole } = require('../controllers/admin');

const router = express.Router();

//新增課程
router.post('/coaches/courses', isAuth, isCoach, handleErrorAsync(postCourse))
//修改課程
router.put('/coaches/courses/:courseId', isAuth, isCoach, handleErrorAsync(putCourse))
//註冊教練身份
router.post('/coaches/:userId', handleErrorAsync(registerCoachRole))

module.exports = router;