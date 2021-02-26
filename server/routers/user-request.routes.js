const express = require('express');
const { findAll, remove, validate, count } = require('../controllers/user-request.controller');
const {auth, admin} = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, admin, findAll);

router.post('/count', auth, admin, count);

router.post('/remove/:id', auth, admin, remove);

router.post('/validate/:id', auth, admin, validate);

module.exports = router;