const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const { isUndefined, isNotValidString, isNotValidInteger } = require('../utils/validate');
const logger = require('../utils/logger')('CreditPackage')

router.get('/', async (req, res, next) => {
  try {
    const creditPackageRepo = await dataSource.getRepository('CreditPackage');
    const package = await creditPackageRepo.find({
      select: ['id', 'name', 'credit_amount', 'price']
    });

    res.status(200).json({
      status: 'success',
      data: package
    })
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, credit_amount, price } = req.body;

    //驗證欄位是否符合格式
    if (isUndefined(name) || isUndefined(credit_amount) || isUndefined(price) || isNotValidString(name) || isNotValidInteger(credit_amount) || isNotValidInteger(price)) {
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    //驗證資料庫內有無資料重複
    const creditPackageRepo = await dataSource.getRepository('CreditPackage');
    const existPackage = creditPackageRepo.find({
      where: {
        name
      }
    });
    if ((await existPackage).length > 0) {
      res.status(409).json({
        status: 'failed',
        message: '資料重複'
      })
      return
    }

    const newPackage = await creditPackageRepo.create({
      name,
      credit_amount,
      price
    });
    const result = await creditPackageRepo.save(newPackage);

    res.status(200).json({
      status: "success",
      data: {
        id: result.id,
        name: result.name,
        credit_amount: result.credit_amount,
        price: result.price
      }
    })
  } catch (error) {
    next(error);
  }
})

router.delete('/:creditPackageId', async (req, res, next) => {
  try {
    let deleteId = req.params.creditPackageId;

    //驗證欄位是否符合格式
    if (isUndefined(deleteId) || isNotValidString(deleteId)) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }

    //驗證是否刪除成功資料庫資料
    const deleteResult = await dataSource.getRepository('CreditPackage').delete(deleteId);
    if (deleteResult.affected === 0) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }

    res.status(200).json({
      status: "success",
    })
  } catch (error) {
    next(error);
  }
})

module.exports = router
