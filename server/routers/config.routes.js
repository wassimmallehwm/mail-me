const express = require('express');
const { findConfig, update } = require('../controllers/config.controller');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', findConfig);

router.post('/update', auth, admin, update);



module.exports = router;


