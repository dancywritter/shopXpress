const router = require('express').Router()
const CartController = require('../controllers/cart')

router.get('/', CartController.index)
router.post('/:sku', CartController.addProduct)
router.put('/:sku', CartController.changeProductQty)
router.delete('/:sku', CartController.removeSingleProduct)
router.delete('/', CartController.empty)

module.exports = router