const express = require('express');

const router = express.Router();
const logger = require('../utils/logger')('Skill')
const { handleErrorAsync } = require('../utils/handleError');
const { getSkills, deleteSkill, postSkill } = require('../controllers/skill');
//取得教練技能列表
router.get('/', handleErrorAsync(getSkills));

//新增教練技能
router.post('/', handleErrorAsync(postSkill))

// 刪除教練技能
router.delete('/:skillId', handleErrorAsync(deleteSkill))

module.exports = router