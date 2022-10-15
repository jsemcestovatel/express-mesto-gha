const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getUserMe,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const regularUrl = /(https?:\/\/)([www.]?[a-zA-Z0-9-]+\.)([^\s]{2,})/;

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regularUrl),
  }),
}), updateAvatar);

module.exports = router;
