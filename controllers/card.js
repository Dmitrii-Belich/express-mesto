const Card = require('../models/card');
const CustomError = require('../utils/utils');

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((Cards) => res.status(200).send(Cards.sort((a, b) => b.createdAt - a.createdAt)))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new CustomError(404, 'Данного id нет в базе'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        Card.findOneAndDelete({ _id: card._id })
          .populate(['owner', 'likes'])
          .orFail(new CustomError(404, 'Данного id нет в базе'))
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          });
      }
    }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id).populate(['owner'])
        .orFail(new CustomError(404, 'Данного id нет в базе'))
        .then((createdCard) => {
          res.status(200).send(createdCard);
        });
    }).catch((err) => next(new CustomError(400, err.message)));
};

module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new CustomError(404, 'Данного id нет в базе'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new CustomError(404, 'Данного id нет в базе'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};
