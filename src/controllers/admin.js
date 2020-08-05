const bcrypt = require('bcrypt');
const Op = require('sequelize').Op;
const { validationResult } = require('express-validator');

const { generateToken } = require('../lib/jwt');

const models = require('../models');
const Admin = models.Admin;

exports.createAdmin = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).json({
      success: false,
      msg: 'Registrasi Admin Gagal!',
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
    .then((admin) => {
      return Admin.findOne({
        where: { id: admin.id },
        attributes: { exclude: ['password'] },
      });
    })
    .then((admin) => {
      const token = generateToken({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: 'Admin',
      });

      return res.status(201).json({
        success: true,
        msg: 'Registrasi Admin Berhasil!',
        user: admin,
        token: `Bearer ${token}`,
        role: 'Admin',
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.loginAdmin = (req, res, next) => {
  const { identifier, password } = req.body;

  let admin;

  if (!identifier || !password) {
    return res.status(401).json({
      success: false,
      msg: 'Mohon Masukkan Username/Email Dan Password!',
      data: {
        identifier: identifier,
      },
    });
  }

  Admin.findOne({
    where: {
      [Op.or]: [{ username: identifier }, { email: identifier }],
    },
  })
    .then((adm) => {
      if (!adm) {
        return res.status(401).json({
          success: false,
          msg: 'Username Tidak Ditemukan!',
          data: {
            identifier: identifier,
          },
        });
      }
      admin = adm;
      return bcrypt.compare(password, adm.password);
    })
    .then((isMatch) => {
      if (isMatch) {
        const token = generateToken({
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: 'Admin',
        });

        return res.json({
          success: true,
          msg: 'Login Berhasil!',
          user: {
            id: admin.id,
            name: admin.name,
            username: admin.username,
            email: admin.email,
          },
          token: `Bearer ${token}`,
          role: 'Admin',
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
