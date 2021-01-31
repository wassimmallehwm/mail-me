const express = require('express');
const { create, findAll, update, remove } = require('../controllers/accounts.controller');
const {auth} = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, create);

router.post('/update', auth, update);

router.post('/remove', auth, remove);

router.post('/', auth, findAll);


module.exports = router;