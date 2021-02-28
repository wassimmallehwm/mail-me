const express = require('express');
const {
  findAll,
  findOne,
  register,
  login,
  refresh,
  uploadImage,
  changePassword,
  remove,
  removeUser,
  update,
  edit,
  add,
} = require("../controllers/user.controller");
const { auth, admin, ownerOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', auth, refresh);

router.post('/upload', auth, uploadImage);

router.post('/change-password', auth, changePassword);

router.post('/findAll', auth, admin, findAll);

router.post('/edit', auth, admin, edit);

router.post('/add', auth, admin, add);

router.post('/:id', auth, findOne);

router.post('/remove/:id', auth, ownerOrAdmin, remove);

router.post('/update', auth, update);

router.post('/remove-user/:id', auth, admin, removeUser);

module.exports = router;