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
  updateUser,
  edit,
  add,
  search,
  photos,
  changePic,
  removePic
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

router.post('/update', auth, updateUser);

router.post('/remove/:id', auth, ownerOrAdmin, remove);

router.post('/remove-user/:id', auth, admin, removeUser);

router.get('/search', auth, search);

router.get('/photos/:id', auth, photos);

router.post('/photos/change', auth, changePic);

router.post('/photos/remove', auth, removePic);

router.post('/:id', auth, findOne);



module.exports = router;