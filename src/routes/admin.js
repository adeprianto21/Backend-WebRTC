const express = require('express');
const { body } = require('express-validator');

const models = require('../models');
const Admin = models.Admin;

const required = require('../lib/requiredField');
const isWhiteSpace = require('../lib/noWhitespaceField');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post(
  '/register',
  [
    // Validation Name
    required('name', 'Nama'),
    body('name').trim(),

    // Validation Username
    required('username', 'Username'),
    isWhiteSpace('username', 'Username'),
    body('username')
      .custom((value) => {
        return Admin.findOne({ where: { username: value } }).then((admin) => {
          if (admin) {
            return Promise.reject('Username sudah digunakan');
          }
          return true;
        });
      })
      .trim(),

    // Validation Password
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password minimal harus 6 karakter')
      .trim(),

    // Validation Email
    body('email')
      .isEmail()
      .withMessage('Email tidak valid')
      .custom((value) => {
        return Admin.findOne({ where: { email: value } }).then((admin) => {
          if (admin) {
            return Promise.reject('Email sudah digunakan');
          }
          return true;
        });
      })
      .normalizeEmail()
      .trim(),
  ],
  adminController.createAdmin
);

router.post('/login', adminController.loginAdmin);

module.exports = router;
