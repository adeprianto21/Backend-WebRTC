const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');

const models = require('../models');
const User = models.User;

const required = require('../lib/requiredField');
const isWhiteSpace = require('../lib/noWhitespaceField');

const userController = require('../controllers/user');

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
        return User.findOne({ where: { username: value } }).then((user) => {
          if (user) {
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
        return User.findOne({ where: { email: value } }).then((user) => {
          if (user) {
            return Promise.reject('Email sudah digunakan');
          }
          return true;
        });
      })
      .normalizeEmail()
      .trim(),
  ],
  userController.createUser
);

router.post('/login', userController.loginUser);

router.get(
  '/test',
  function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (
      err,
      user,
      info
    ) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json({ msg: 'Tidak Terotentifikasi' });
      }
      next();
    })(req, res, next);
  },
  (req, res, next) => {
    return res.json({ msg: 'berhasil' });
  }
);

module.exports = router;
