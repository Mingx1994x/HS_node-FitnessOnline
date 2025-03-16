const express = require('express');

const router = express.Router();
const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Skill')
const { isUndefined, isNotValidString } = require('../utils/validate');
const { appError, handleErrorAsync } = require('../utils/handleError');

const skillRepo = dataSource.getRepository('Skill');

//取得教練技能列表
router.get('/', handleErrorAsync(async (req, res, next) => {
  const skills = await skillRepo.find({
    select: ['id', 'name']
  })
  res.status(200).json({
    status: 'success',
    data: skills
  })
}))

//新增教練技能
router.post('/', handleErrorAsync(async (req, res, next) => {
  const { name } = req.body;
  //驗證欄位是否符合格式
  if (isUndefined(name) || isNotValidString(name)) {
    return next(appError(400, '欄位未填寫正確'));
  }

  //驗證資料庫有無重複資料
  const existSkill = await skillRepo.find({
    where: {
      name
    }
  })

  if (existSkill.length > 0) {
    return next(appError(409, '資料重複'));
  }

  const newSkill = skillRepo.create({
    name
  });
  const result = await skillRepo.save(newSkill);

  res.status(200).json({
    status: 'success',
    data: {
      id: result.id,
      name: result.name
    }
  })
}))

// 刪除教練技能
router.delete('/:skillId', handleErrorAsync(async (req, res, next) => {
  const deleteId = req.params.skillId;

  //驗證id格式是否正確
  if (isUndefined(deleteId) || isNotValidString(deleteId)) {
    return next(appError(400, 'ID錯誤'));
  }

  //驗證資料庫是否刪除
  const deleteResult = await skillRepo.delete(deleteId);
  if (deleteResult.affected === 0) {
    return next(appError(400, 'ID錯誤'));
  }

  res.status(200).json({
    status: 'success'
  })
}))

module.exports = router