const express = require('express');
const { findAll, findOne, register, login, update, verifyToken, current, refresh } = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', auth, refresh);

router.post('/verifyToken', verifyToken);

router.get('/', auth, findAll);

router.get('/current', auth, current);

router.get('/:id', findOne);

router.post('/update/:id', update);

module.exports = router;