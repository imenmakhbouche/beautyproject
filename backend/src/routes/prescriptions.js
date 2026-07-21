const express = require('express');
const {
  getPrescriptions,
  createPrescription
} = require('../controllers/prescriptionController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getPrescriptions);
router.post('/', authorize('doctor'), createPrescription);

module.exports = router;