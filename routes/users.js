const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  changeUser,
  changeUserAvatar,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', createUser);

router.patch('/me', changeUser);

router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
