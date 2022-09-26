const User = require('../models/user');

const INPUT_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const ERROR_CODE = 500;

const errorHandler = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(INPUT_ERROR_CODE).send({
      message: 'Переданы некорректные данные.',
    });
  }
  if (err.name === 'CastError') {
    return res.status(NOT_FOUND_ERROR_CODE).send({
      message: 'Пользователь с указанным _id не найден.',
    });
  }
  return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const err = new Error();
      err.name = 'CastError';
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      errorHandler(err, res);
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
      errorHandler(err, res);
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
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      errorHandler(err, res);
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
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};
