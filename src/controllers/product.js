const models = require('../models');

const Category = models.Category;
const Product = models.Product;

exports.getCategories = (req, res, next) => {
  Category.findAll({ attributes: ['id', 'category'] })
    .then((cat) => {
      return res.json({
        success: true,
        msg: 'Get Categories Berhasil!',
        categories: cat,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAllProducts = (req, res, next) => {
  Product.findAll({ include: { model: Category } })
    .then((products) => {
      return res.json({ products });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createProduct = (req, res, next) => {
  Product.create({
    name: req.body.name,
    description: req.body.description,
    categoryId: req.body.categoryId,
    price: req.body.price,
    stock: req.body.stock,
    image: req.file.filename,
  })
    .then((product) => {
      return res.json({ product });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
