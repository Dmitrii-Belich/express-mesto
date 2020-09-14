const Card = require('../models/card');
const { ERROR_CODES, DataBaseError } = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((Cards) => res.status(200).send(Cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.id })
    .populate(['owner', 'likes'])
    .orFail(new DataBaseError(ERROR_CODES.IdError.message, ERROR_CODES.IdError.name))
    .then((card) => {
      res.status(200).send(card);
    })
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

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === ERROR_CODES.ValidationError.name) {
        res.status(ERROR_CODES.ValidationError.code)
          .send({ message: ERROR_CODES.ValidationError.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new DataBaseError(ERROR_CODES.IdError.message, ERROR_CODES.IdError.name))
    .then((card) => res.status(200).send(card))
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

module.exports.dislikeCard = (req, res) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new DataBaseError(ERROR_CODES.IdError.message, ERROR_CODES.IdError.name))
    .then((card) => res.status(200).send(card))
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
