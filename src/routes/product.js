const express = require('express');

const productController = require('../controllers/product');

const router = express.Router();

router.get('/categories', productController.getCategories);

module.exports = router;
