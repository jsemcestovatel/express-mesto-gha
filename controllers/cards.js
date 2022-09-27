const Card = require('../models/card');
const mongoose = require('mongoose');

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
      message: 'Карточка с указанным _id не найдена.',
    });
  }
  return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ cards });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        createdAt: card.createdAt,
      });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    //   Card.findById(id)
    //   .orFail(() => {

    //   })
    //   .then((card) => Card.deleteOne(card)
    //     .then(() => res.send({           name: card.name,
    //       link: card.link,
    //       owner: card.owner,
    //       _id: card._id,
    // }))

    // if (err.name === 'CastError') {
    //   // Невалидный идентификатор карточки
    // } else if (err.statusCode === 404) {
    //  // нет карточки
    // } else {
    //  // дефолтная ошибка
    // }

    Card.findByIdAndRemove(req.params.cardId)
      .orFail(() => {
        // const err = new Error();
        // err.name = 'CastError';
        // err.statusCode = 404;
        // throw err;
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      })
      .then((card) => {
        res.send({
          name: card.name,
          link: card.link,
          owner: card.owner,
          _id: card._id,
        });
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } else {
    // const err = new Error();
    // err.name = 'ValidationError';
    // errorHandler(err, res);
    // throw err;
    res
      .status(INPUT_ERROR_CODE)
      .send({ message: 'Переданы некорректные данные.' });
  }
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true, upsert: true },
  )
    .orFail(() => {
      const err = new Error();
      err.name = 'CastError';
      err.statusCode = 404;
      throw err;
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        likes: card.likes,
      });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true, upsert: true },
  )
    .orFail(() => {
      const err = new Error();
      err.name = 'CastError';
      err.statusCode = 404;
      throw err;
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        likes: card.likes,
      });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};
