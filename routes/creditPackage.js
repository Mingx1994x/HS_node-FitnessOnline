const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const { isUndefined, isNotValidString, isNotValidInteger } = require('../utils/validate');
const { appError, handleErrorAsync } = require('../utils/handleError');
const logger = require('../utils/logger')('CreditPackage')

const creditPackageRepo = dataSource.getRepository('CreditPackage');

//取得課程組合包
router.get('/', handleErrorAsync(async (req, res, next) => {
  const package = await creditPackageRepo.find({
    select: ['id', 'name', 'credit_amount', 'price']
  });

  res.status(200).json({
    status: 'success',
    data: package
  })
}))

//新增課程組合包
router.post('/', handleErrorAsync(async (req, res, next) => {
  const { name, credit_amount, price } = req.body;

  //驗證欄位是否符合格式
  if (isUndefined(name) || isUndefined(credit_amount) || isUndefined(price) || isNotValidString(name) || isNotValidInteger(credit_amount) || isNotValidInteger(price)) {
    return next(appError(400, '欄位未填寫正確'));
  }

  //驗證資料庫內有無資料重複
  const existPackage = creditPackageRepo.find({
    where: {
      name
    }
  });
  if ((await existPackage).length > 0) {
    return next(appError(409, '資料重複'));
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
}))

//刪除課程組合包
router.delete('/:creditPackageId', handleErrorAsync(async (req, res, next) => {
  let deleteId = req.params.creditPackageId;

  //驗證欄位是否符合格式
  if (isUndefined(deleteId) || isNotValidString(deleteId)) {
    return next(appError(400, 'ID錯誤'));
  }

  //驗證是否刪除成功資料庫資料
  const deleteResult = await creditPackageRepo.delete(deleteId);
  if (deleteResult.affected === 0) {
    return next(appError(400, 'ID錯誤'));
  }

  res.status(200).json({
    status: "success",
  })
}))

module.exports = router
