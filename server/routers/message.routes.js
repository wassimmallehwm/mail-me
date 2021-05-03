const express = require('express');
const { create, findByConv } = require('../controllers/message.controller');
const {auth, admin,} = require('../middleware/auth');
const router = express.Router();



router.post('/', auth, create);

router.get('/:conversation', auth, findByConv);


module.exports = router;