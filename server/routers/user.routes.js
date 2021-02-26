const express = require('express');
const { findAll, findOne, register, login, refresh, uploadImage, changePassword } = require('../controllers/user.controller');
const {auth, admin} = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', auth, refresh);

router.post('/upload', auth, uploadImage);

router.post('/change-password', auth, changePassword);

router.post('/findAll', auth, admin, findAll);

router.post('/:id', auth, findOne);

module.exports = router;