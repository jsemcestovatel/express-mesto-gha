const User = require('../models/user');

const INPUT_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INPUT_ERROR_CODE).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INPUT_ERROR_CODE).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res
          .status(INPUT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res
          .status(INPUT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};
