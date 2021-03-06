const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const CustomError = require('../utils/utils');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((Users) => res.status(200).send(Users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new CustomError(404, 'Данный пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new CustomError(404, 'Данный пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { password, email } = req.body;
  bcrypt.hash(password, 10).then((hashPassword) => {
    User.create({ password: hashPassword, email })
      .then((user) => res.status(200).send({ _id: user._id }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new CustomError(409, err.message));
        } else {
          next(new CustomError(400, err.message));
        }
      });
  });
};

/* Сделал name, about и avatar с дефолтными значениями при регистрации
чтобы была возможность связать API с фронтендом, так как там при регистрации
указываются только email и password */

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.changeUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new CustomError(404, 'Данный пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new CustomError(404, 'Данный пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};
