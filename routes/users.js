const router = require('express').Router();
const path = require('path');
const fs = require('fs');

let users = [];
const readFile = (req, res, next) => {
  fs.readFile(path.join(__dirname, '..', 'data/users.json'), (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    try {
      users = JSON.parse(data);
      next();
    } catch (parseErr) {
      res.status(500).send({ message: parseErr.message });
    }
  });
};

router.get('/', readFile);
router.get('/', (req, res) => {
  res.send(users);
});

router.get('/:id', readFile);
router.get('/:id', (req, res) => {
  const user = users.find((item) => item._id === req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
  }
});

module.exports = router;
