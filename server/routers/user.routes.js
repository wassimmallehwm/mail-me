const express = require('express');
const { findAll, findOne, register, login, update, verifyToken, current, refresh, uploadImage, changePassword } = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', auth, refresh);

router.post('/upload', auth, uploadImage);

router.post('/verifyToken', verifyToken);

router.post('/change-password', auth, changePassword);

router.get('/current', auth, current);

router.get('/:id', findOne);

router.post('/update', auth, update);

module.exports = router;