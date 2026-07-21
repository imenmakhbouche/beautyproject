const express = require('express');
const {
  getMessages,
  sendMessage,
  markAsRead
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/:patientId', getMessages);
router.post('/', sendMessage);
router.patch('/:id/read', markAsRead);

module.exports = router;