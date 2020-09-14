class DataBaseError extends Error {
  constructor(message, name) {
    super(message);
    this.name = name;
  }
}

const ERROR_CODES = {
  ValidationError: {
    code: 400,
    name: 'ValidationError',
    message: 'Получены невалидные данные',
  },
  CastError: {
    code: 404,
    name: 'CastError',
    message: 'Получен невалидный id',
  },
  IdError: {
    code: 404,
    name: 'NotValidId',
    message: 'Данного id нет в базе',
  },
};

module.exports = { DataBaseError, ERROR_CODES };
