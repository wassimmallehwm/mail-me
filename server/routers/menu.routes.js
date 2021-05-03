const express = require('express');
const { create, update, findAll, findAllByRole, findAllArtificial, setForm, getForm, findAllGuest, submitConfig, remove, updateOrder } = require('../controllers/menus.controller');
const {auth, admin} = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, admin, create);

router.post('/update', auth, admin, update);

router.post('/updateOrder', auth, admin, updateOrder);

router.post('/submitConfig', auth, admin, submitConfig);

router.post('/findAll', auth, admin, findAll);

router.post('/findAllByRole', auth, findAllByRole);

router.post('/findAllGuest', auth, findAllGuest);

router.post('/findAllArtificial', auth, admin, findAllArtificial);

router.post('/setForm', auth, admin, setForm);

router.post('/getForm', auth, getForm);

router.post('/remove/:id', auth, admin, remove);


module.exports = router;