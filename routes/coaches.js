const express = require('express');

const logger = require('../utils/logger')('Coach');
const { handleErrorAsync } = require('../utils/handleError');
const { getCoaches, getCoachById } = require('../controllers/coaches');

const router = express.Router();

// 取得教練列表
router.get('/', handleErrorAsync(getCoaches))

// 取得教練資料
router.get('/:coachId', handleErrorAsync(getCoachById))

module.exports = router