const router = require('express').Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'data/cards.json'), (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    try {
      const cards = JSON.parse(data);
      res.send(cards);
    } catch (parseErr) {
      res.status(500).send({ message: parseErr.message });
    }
  });
});

module.exports = router;
