const Card = require('../models/card');
// const mongoose = require('mongoose');

const INPUT_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ cards });
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
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
      if (err.name === 'ValidationError') {
        res.status(INPUT_ERROR_CODE).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      const err = new Error();
      err.name = 'NotValidID';
      throw err;
    })
    .then((card) => {
      Card.findOneAndDelete(card).then(() => {
        res.send({
          name: card.name,
          link: card.link,
          owner: card.owner,
          _id: card._id,
          likes: card.likes,
        });
      });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'NotValidID') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(INPUT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true, upsert: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        likes: card.likes,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INPUT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true, upsert: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        likes: card.likes,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INPUT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};
