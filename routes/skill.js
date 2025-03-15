const express = require('express');

const router = express.Router();
const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Skill')
const { isUndefined, isNotValidString } = require('../utils/validate');

router.get('/', async (req, res, next) => {
  try {
    const skillRepo = await dataSource.getRepository('Skill');
    const skills = await skillRepo.find({
      select: ['id', 'name']
    })
    res.status(200).json({
      status: 'success',
      data: skills
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {

    const { name } = req.body;

    //驗證欄位是否符合格式
    if (isUndefined(name) || isNotValidString(name)) {
      res.status(400), json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    //驗證資料庫有無重複資料
    const skillRepo = await dataSource.getRepository('Skill');
    const existSkill = await skillRepo.find({
      where: {
        name
      }
    })

    if (existSkill.length > 0) {
      errorResponse(res, headers, 409, 'failed', '資料重複');
      res.status(409).json({
        status: 'failed',
        message: '資料重複'
      })
      return
    }

    const newSkill = await skillRepo.create({
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
  } catch (error) {
    next(error);
  }
})

router.delete('/:skillId', async (req, res, next) => {
  try {
    let deleteId = req.params.skillId;

    //驗證id格式是否正確
    if (isUndefined(deleteId) || isNotValidString(deleteId)) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }

    //驗證資料庫是否刪除
    const deleteResult = await dataSource.getRepository('Skill').delete(deleteId);
    if (deleteResult.affected === 0) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }

    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router