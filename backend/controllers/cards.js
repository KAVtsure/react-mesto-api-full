const Card = require('../models/card');
const IncorrectReqDataError = require('../utils/IncorrectReqDataError');
const ServerError = require('../utils/ServerError');
const NotFoundError = require('../utils/NotFoundError');
const CardDeleteError = require('../utils/CardDeleteError');

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new IncorrectReqDataError('Переданы некорректные данные при создании карточки'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const getCard = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    next(new ServerError('Ошибка по умолчанию'));
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      next(new NotFoundError('Карточка с указанным _id не найдена'));
      return;
    }
    if (card.owner.toString() !== req.user._id) {
      next(new CardDeleteError('Невозможно удалить чужую карточку'));
      return;
    }
    await Card.deleteOne(card);
    res.send({ message: 'Карточка успешно удалена' });
  } catch (e) {
    if (e.name === 'CastError') {
      next(new IncorrectReqDataError('Невалидный ID карточки'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      next(new NotFoundError('Передан несуществующий _id карточки'));
      return;
    }
    res.send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      next(new IncorrectReqDataError('Переданы некорректные данные для постановки/снятии лайка'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      next(new NotFoundError('Передан несуществующий _id карточки'));
      return;
    }
    res.send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      next(new IncorrectReqDataError('Переданы некорректные данные для постановки/снятии лайка'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

module.exports = {
  getCard, deleteCard, createCard, likeCard, dislikeCard,
};
