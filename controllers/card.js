const Card = require('../models/card');

const ERROR_CODES = {
  ValidationError: 400,
  CastError: 404,
};

module.exports.getCards = (req, res) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((Cards) => res.status(200).send(Cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id).populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(ERROR_CODES[err.name] || 500).send({ message: err.message }));
};
