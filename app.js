const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cards = require('./routes/cards');
const users = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '5f589e7e6afbd92968931697',
  };
  next();
});

app.use('/cards', cards);

app.use('/users', users);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
