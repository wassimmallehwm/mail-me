const express = require('express');
const { create, findByUser } = require('../controllers/conversation.controller');
const {auth, admin} = require('../middleware/auth');
const router = express.Router();


router.post('/', auth, create);

router.get('/:userId', auth, findByUser);


module.exports = router;