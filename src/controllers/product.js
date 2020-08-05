const models = require('../models');

const Category = models.Category;

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
