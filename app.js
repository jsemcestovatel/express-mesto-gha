const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const handlerErrors = require('./middlewares/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(routes);

// централизованный обработчик
app.use(handlerErrors);

app.listen(PORT, () => {});
