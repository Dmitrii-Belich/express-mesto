const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(3),
  }),
}), createCard);

router.delete('/:id', deleteCard);

router.put('/likes/:cardId', likeCard);

router.delete('/likes/:cardId', dislikeCard);

module.exports = router;
