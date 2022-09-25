const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { routes } = require('./routes/index');
const NotFoundError = require('./utils/NotFoundError');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');
const { loginValidate, createUserValidate } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  await app.listen(PORT);
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', createUserValidate, createUser);
app.post('/signin', loginValidate, login);

app.use(auth);

app.use(routes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);
