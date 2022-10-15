const router = require('express').Router();
const routerUser = require('./users');
const routerCard = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, logout, createUser } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../middlewares/validations');

router.post(
  '/signin',
  validateAuthentication,
  login,
);

router.post(
  '/signup',
  validateUserBody,
  createUser,
);

router.get(
  '/signout',
  logout,
);

router.use(auth);
router.use('/users', routerUser);
router.use('/cards', routerCard);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
