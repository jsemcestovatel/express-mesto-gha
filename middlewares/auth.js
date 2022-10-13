const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new NotAuthorizedError('Необходима авторизация'));
    return;
  }
  let payload;

  try {
    payload = jwt.verify(
      token,
      'testkey',
    );
  } catch (err) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
