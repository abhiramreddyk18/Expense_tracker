const express = require('express');
const router = express.Router();
const { send_message, users_messages } = require('../controllers/chatcontroller');

router.post('/send', send_message);
router.get('/:user1Id/:user2Id', users_messages);

module.exports = router;
