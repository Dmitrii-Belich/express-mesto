const User = require('../models/user');

const ERROR_CODES = {
  ValidationError: 400,
  CastError: 404,
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((Users) => res.status(200).send(Users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};

module.exports.changeUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};
