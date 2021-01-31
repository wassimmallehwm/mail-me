const express = require('express');
const { sendMail, sendReadMail, mails, mailById } = require('../controllers/mail.controller');
const {auth} = require('../middleware/auth');
const router = express.Router();

router.post('/send', sendMail);

router.post('/', auth, mails);

router.post('/:mailId', auth, mailById);

router.get('/read/:senderId/:date', sendReadMail);


module.exports = router;