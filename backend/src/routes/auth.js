const express = require('express');
const { register, login, getMe, completePatientRegistration } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/complete-registration', auth, completePatientRegistration);

module.exports = router;