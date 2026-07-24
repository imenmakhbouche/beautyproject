const express = require('express');
const { register, login, getMe, completePatientRegistration } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/complete-registration', auth, completePatientRegistration);

// ─── UPDATE USER PROFILE ──────────────────────────────────────────────────
router.put('/me', auth, async (req, res) => {
    try {
        const { name, email, phone, birthDate, address } = req.body;

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: {
                name,
                email,
                phone,
                birthDate,
                address
            }
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;