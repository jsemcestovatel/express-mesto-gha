const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const ERROR_CODE = 500;
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик
app.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message,
    });
  next();
});

app.listen(PORT, () => {});
