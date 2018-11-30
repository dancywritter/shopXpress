const router = require('express').Router()
const ProductMiddleWare = require('../middlewares/product')
const ProductsController = require('../controllers/product')

router.get('/', ProductMiddleWare.getAll)
router.get('/', ProductsController.index)

module.exports = router