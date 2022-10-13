const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then(() => {
          res.send({
            name: card.name,
            link: card.link,
            owner: card.owner,
            _id: card._id,
            likes: card.likes,
          });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
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
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // изъять _id из массива, если он там есть
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
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
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};
