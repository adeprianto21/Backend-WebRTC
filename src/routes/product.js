const express = require('express');
const path = require('path');

const productController = require('../controllers/product');

const router = express.Router();

router.use(
  '/image',
  express.static(path.join(__dirname, '..', 'uploads', 'images'))
);

router.get('/categories', productController.getCategories);

router.get('/getAll', productController.getAllProducts);

router.post('/createProduct', productController.createProduct);

module.exports = router;
