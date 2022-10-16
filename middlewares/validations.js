const { celebrate, Joi } = require('celebrate');

const regularUrl = /(https?:\/\/)([www.]?[a-zA-Z0-9-]+\.)([^\s]{2,})/;

module.exports.validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regularUrl),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
