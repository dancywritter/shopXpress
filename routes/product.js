const router = require('express').Router()
const ProductMiddleWare = require('../middlewares/product')
const ProductsController = require('../controllers/product')

router.get('/', ProductMiddleWare.getAll)
router.get('/', ProductsController.index)

// TODO: router.post('/', ProductMiddleWare.create)
router.post('/', ProductsController.create)

router.get('/:sku', ProductsController.retrieve)

router.put('/:sku', ProductsController.update)

router.delete('/:sku', ProductsController.delete)

module.exports = router