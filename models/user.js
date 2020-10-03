const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const CustomError = require('../utils/utils');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Указан некорректный email',
    },
  },

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Ваше имя',
  },

  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'О вас',
  },

  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/(www\.)?)[\w-]+\.[\w./():,-]+#?$/.test(v);
      },
      message: 'Указана некорректная ссылка',
    },
    default: 'https://www.shareicon.net/data/2017/05/09/885769_user_512x512.png',
  },

  password: {
    type: String,
    required: true,
    minlength: 3,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new CustomError(401, 'Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new CustomError(401, 'Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
