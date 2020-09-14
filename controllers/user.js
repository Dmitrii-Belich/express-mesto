const User = require('../models/user');
const { ERROR_CODES, DataBaseError } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((Users) => res.status(200).send(Users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new DataBaseError(ERROR_CODES.IdError.message, ERROR_CODES.IdError.name))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === ERROR_CODES.IdError.name) {
        res.status(ERROR_CODES.IdError.code).send({ message: ERROR_CODES.IdError.message });
        return;
      }
      if (err.name === ERROR_CODES.CastError.name) {
        res.status(ERROR_CODES.CastError.code).send({ message: ERROR_CODES.CastError.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === ERROR_CODES.ValidationError.name) {
        res.status(ERROR_CODES.ValidationError.code)
          .send({ message: ERROR_CODES.ValidationError.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.changeUser = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new DataBaseError(ERROR_CODES.IdError.message, ERROR_CODES.IdError.name))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === ERROR_CODES.IdError.name) {
        res.status(ERROR_CODES.IdError.code).send({ message: ERROR_CODES.IdError.message });
        return;
      }
      if (err.name === ERROR_CODES.CastError.name) {
        res.status(ERROR_CODES.CastError.code).send({ message: ERROR_CODES.CastError.message });
        return;
      }
      if (err.name === ERROR_CODES.ValidationError.name) {
        res.status(ERROR_CODES.ValidationError.code)
          .send({ message: ERROR_CODES.ValidationError.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new DataBaseError(ERROR_CODES.IdError.message, ERROR_CODES.IdError.name))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === ERROR_CODES.IdError.name) {
        res.status(ERROR_CODES.IdError.code).send({ message: ERROR_CODES.IdError.message });
        return;
      }
      if (err.name === ERROR_CODES.CastError.name) {
        res.status(ERROR_CODES.CastError.code).send({ message: ERROR_CODES.CastError.message });
        return;
      }
      if (err.name === ERROR_CODES.ValidationError.name) {
        res.status(ERROR_CODES.ValidationError.code)
          .send({ message: ERROR_CODES.ValidationError.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
