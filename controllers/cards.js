const Card = require('../models/card');

const errorHandler = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({
      message: 'Переданы некорректные данные.',
    });
  }
  if (err.name === 'CastError') {
    return res.status(404).send({
      message: 'Карточка с указанным _id не найдена.',
    });
  }
  return res.status(500).send({ message: 'Ошибка по умолчанию' });
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
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const err = new Error();
      err.name = 'CastError';
      err.statusCode = 404;
      throw err;
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
