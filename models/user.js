const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
// const regularUrl = /(https?:\/\/)([www.]?[a-zA-Z0-9-]+\.)([^\s]{2,})/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'От 2 до 30 символов'],
    maxlength: [30, 'От 2 до 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'От 2 до 30 символов'],
    maxlength: [30, 'От 2 до 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: (v) => `Некорректный формат ссылки ${v.value}`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Обязательное поле'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (v) => `Некорректный формат почты ${v.value}`,
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательное поле'],
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
