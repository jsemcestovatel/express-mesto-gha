const { isValidEmail, isValidPassword, validateUserInput } = require('../index.js');

// Для удобства можете использовать эти данные, в качестве тестовых, но можете добавить свои
const dataValid = { email: 'bob@yandex.ru', password: '1amAp0k3m0n%'  };
const dataInvalidPassword = { email: 'bob@yandex.ru', password: '123456' };
const dataInvalidEmail = { email: 'bob', password: '1amAp0k3m0n%'  };
const dataInvalidCredentials = { email: 'bob', password: '12345'  };

// Ваши тесты здесь

