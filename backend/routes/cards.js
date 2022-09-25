const express = require('express');
const { createCardValidate, deleteCarddValidate, rateCarddValidate } = require('../middlewares/validation');

const cardRoutes = express.Router();
const {
  getCard, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.post('/', createCardValidate, createCard);

cardRoutes.get('/', getCard);

cardRoutes.delete('/:cardId', deleteCarddValidate, deleteCard);

cardRoutes.put('/:cardId/likes', rateCarddValidate, likeCard);

cardRoutes.delete('/:cardId/likes', rateCarddValidate, dislikeCard);

module.exports = { cardRoutes };
