const router = require('express').Router();
const ProductsRouter = require('./product');
const CartRouter = require('./cart');

router.all('/', (req, res) => {
  if(req.method == 'GET') {
    res.json({status: true, message: "shopXpress an expressJS based RESTful ecommerce engine."})
  } else {
    res.status(405).json({status: false, message: "Method "+req.method.toUpperCase()+" not allowed on /"})
  }
});
router.all('/hello', (req, res) => res.json({status:true, message: "Hello World!"}));

router.use('/products', ProductsRouter)
router.use('/cart', CartRouter)

//handle 404
router.use((req, res, next) => {
  res.status(404).json({status:false, message: "Route "+req.path+" not found"});
});

//handle 500
router.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});

module.exports = router;