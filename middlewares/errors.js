const ERROR_CODE = 500;

module.exports.handlerErrors = (err, req, res, next) => {
  const { statusCode = ERROR_CODE, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'Ошибка по умолчанию' : message,
  });
  next();
};
