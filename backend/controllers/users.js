const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { RES_OK } = require('../utils/codes');
const IncorrectReqDataError = require('../utils/IncorrectReqDataError');
const EmailExistingError = require('../utils/EmailExistingError');
const ServerError = require('../utils/ServerError');
const NotFoundError = require('../utils/NotFoundError');
const AuthError = require('../utils/AuthError');

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    res.status(RES_OK).send(user);
  } catch (e) {
    if (e.code === 11000) {
      next(new EmailExistingError('Пользователь с таким email уже существует'));
      return;
    }
    if (e.name === 'ValidationError') {
      next(new IncorrectReqDataError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(RES_OK).send(users);
  } catch (e) {
    next(new ServerError('Ошибка по умолчанию'));
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
      return;
    }
    res.status(RES_OK).send(user);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new IncorrectReqDataError('Невалидный ID пользователя'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
      return;
    }
    res.status(RES_OK).send(user);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new IncorrectReqDataError('Невалидный ID пользователя'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const updateUserProfile = async (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
      return;
    }
    res.status(RES_OK).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new IncorrectReqDataError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const updateAvatar = async (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
      return;
    }
    res.status(RES_OK).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new IncorrectReqDataError('Переданы некорректные данные при обновлении аватара'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password');
    if (!user) {
      next(new AuthError('Неправильные почта или пароль'));
      return;
    }
    const resultMatching = await bcrypt.compare(password, user.password);
    if (!resultMatching) {
      next(new AuthError('Неправильные почта или пароль'));
      return;
    }
    const token = jwt.sign({ _id: user._id }, 'incredibly-secure-key', { expiresIn: '7d' });
    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send({ data: user.toJSON() })
      .end();
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new IncorrectReqDataError('Невалидный ID пользователя'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

module.exports = {
  getUser, getCurrentUser, getUserById, createUser, updateUserProfile, updateAvatar, login,
};
