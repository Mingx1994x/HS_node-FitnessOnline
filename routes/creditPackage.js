const express = require('express')

const router = express.Router();
const { handleErrorAsync } = require('../utils/handleError');
const { getCreditPackage, postCreditPackage, deleteCreditPackage } = require('../controllers/creditPackage');
const logger = require('../utils/logger')('CreditPackage')

//取得課程組合包
router.get('/', handleErrorAsync(getCreditPackage))

//新增課程組合包
router.post('/', handleErrorAsync(postCreditPackage))

//刪除課程組合包
router.delete('/:creditPackageId', handleErrorAsync(deleteCreditPackage))

module.exports = router
