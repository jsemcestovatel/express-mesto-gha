const router = require('express').Router();

const ERROR_CODE = 500;

router.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'Ошибка по умолчанию' : message,
  });
  next();
});

module.exports = router;
