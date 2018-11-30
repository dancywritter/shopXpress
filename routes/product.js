const router = require('express').Router()
const ProductsController = require('../controllers/product')

router.get('/', ProductsController.index)
router.post('/', ProductsController.create)
router.get('/:sku', ProductsController.retrieve)
router.put('/:sku', ProductsController.update)
router.delete('/:sku', ProductsController.delete)

module.exports = router