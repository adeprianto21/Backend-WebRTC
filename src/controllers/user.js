const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Op = require('sequelize').Op;

const models = require('../models');
const User = models.User;
const { generateToken } = require('../lib/jwt');

exports.createUser = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).json({
      success: false,
      msg: error.errors[0].msg,
      errors: error.errors,
    });
  }

  bcrypt
    .hash(req.body.password, 12)
    .then((hashPass) => {
      return User.create({
        name: req.body.name,
        username: req.body.username,
        password: hashPass,
        email: req.body.email,
      });
    })
    .then((user) => {
      return User.findOne({
        where: { id: user.id },
        attributes: { exclude: ['password'] },
      });
    })
    .then((user) => {
      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: 'User',
      });

      return res.status(201).json({
        success: true,
        msg: 'Registrasi User Berhasil!',
        user: user,
        token: `Bearer ${token}`,
        role: 'User',
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.loginUser = (req, res, next) => {
  const { identifier, password } = req.body;

  let user;

  if (!identifier || !password) {
    return res.status(401).json({
      success: false,
      msg: 'Mohon Masukkan Username/Email Dan Password!',
      data: {
        identifier: identifier,
      },
    });
  }

  User.findOne({
    where: {
      [Op.or]: [{ username: identifier }, { email: identifier }],
    },
  })
    .then((usr) => {
      if (!usr) {
        return res.status(401).json({
          success: false,
          msg: 'Username Tidak Ditemukan!',
          data: {
            identifier: identifier,
          },
        });
      }
      user = usr;
      return bcrypt.compare(password, usr.password);
    })
    .then((isMatch) => {
      if (isMatch) {
        const token = generateToken({
          id: user.id,
          username: user.username,
          email: user.email,
        });

        return res.json({
          success: true,
          msg: 'Login Berhasil!',
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
          },
          token: `Bearer ${token}`,
          role: 'User',
        });
      } else {
        return res.status(401).json({
          success: false,
          msg: 'Password Yang Anda Masukkan Salah!',
          data: {
            identifier: identifier,
          },
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
