const Product = require('../models/product')

module.exports = {
  /**
   * index
   * 
   * method to fetch all products (use case: listing)
   * 
   * @param {Request} req 
   * @param {Response} res 
   */
  async index(req, res) {
    const page = typeof req.query.page == 'undefined' ? 1 : parseInt(req.query.page)
    const size = typeof req.query.size == 'undefined' ? 100 : parseInt(req.query.size)

    //get total page
    const totalProducts = await Product.countDocuments();

    Product.find().skip((page - 1) * size).limit(size)
      .then(products => res.json({
        status: true,
        message: "Showing available products",
        products: products,
        pagination: {
          page: page,
          totalPages: Math.ceil(totalProducts /size),
          pageSize: size,
          total: totalProducts,
          showing: products.length,
        }
      }))
      .catch(err => res.status(500).json({
        status: false,
        message: err.message,
        errorCode: err.code
      }))
  },

  /**
   * create
   * 
   * method to create a product
   * 
   * @param {Request} req 
   * @param {Response} res 
   */
  async create(req, res) {
    const product = new Product(req.body)
    await product.save().then(product => {
      res.json({
        status:true,
        message: "Product with sku: "+product.sku+" created successfully!",
        product: product
      })
    }).catch(err => {
      res.status(500).json({
        status:false,
        message: err.code == 11000 ? "Product with sku: "+req.body.sku+" already exist!" : err.message
      })
    })
  },

  /**
   * retrieve
   * 
   * method to retrieve a product
   * 
   * @param {Request} req
   * @param {Response} res
   */
  async retrieve(req, res) {
    await Product.findOne({sku: req.params.sku})
      .then(product => {
        if(product)
          res.json({status: true, message: "Showing product with sku: "+product.sku, product})
        else 
          res.json({status: false, message: "Product with sku: "+req.params.sku+" doesn't exist!"})
      })
      .catch(err => res.json({status: false, message: err.message, errorCode: err.code}))
  },

  /**
   * update
   * 
   * method to update a product
   * 
   * @param {Request} req 
   * @param {Response} res 
   */
  async update(req, res) {    
    const product = await Product.findOne({sku: req.params.sku})      
      .catch(err => res.json({status: false, message: err.message, errorCode: err.code}))    
    if(product) {          
      await Product.updateOne({sku: req.params.sku}, {$set: req.body})
        .catch(err => res.json({status: false, message: err.message, errorCode: err.code}))

      await Product.findOne({sku: product.sku}).then(product => res.json({
        status: true,
        message: "Product with sku: "+product.sku+" updated!",
        product
      }))
    } else {
      res.json({status: false, message: "Product with sku: "+req.params.sku+" doesn't exist!"})
    }
  },

  /**
   * delete
   * 
   * @param {Request} req 
   * @param {Response} res 
   */
  async delete(req, res) {
    const product = await Product.findOne({sku: req.params.sku})      
      .catch(err => res.json({status: false, message: err.message, errorCode: err.code}))    
    if(product) {          
      await Product.deleteOne({sku: req.params.sku})
        .then(() => res.json({status: true, message: "Product with sku: "+req.params.sku+" deleted!"}))
        .catch(err => res.json({status: false, message: err.message, errorCode: err.code}))
    } else {
      res.json({status: false, message: "Product with sku: "+req.params.sku+" doesn't exist!"})
    }
  }
}