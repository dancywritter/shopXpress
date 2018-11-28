const router = require('express').Router();

router.all('/', (req, res) => {
  if(req.method == 'GET') {
    res.json({status: true, message: "shopXpress an expressJS based RESTful ecommerce engine."})
  } else {
    res.status(405).json({status: false, message: "Method "+req.method.toUpperCase()+" not allowed on /"})
  }
});
router.all('/hello', (req, res) => res.json({status:true, message: "Hello World!"}));

module.exports = router;