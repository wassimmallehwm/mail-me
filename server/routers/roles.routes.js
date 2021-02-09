const express = require('express');
const { findAll, test } = require('../controllers/role.controller');
const {auth, admin,} = require('../middleware/auth');
const router = express.Router();

//router.post('/create', auth, admin, create);

// router.post('/update', auth, update);

// router.post('/remove', auth, remove);

router.post('/findAll', auth, admin, findAll);

//router.post('/test', auth, test);


module.exports = router;