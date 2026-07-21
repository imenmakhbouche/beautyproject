const express = require('express');
const {
  getSchedule,
  updateSchedule
} = require('../controllers/scheduleController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getSchedule);
router.put('/:day', authorize('secretary'), updateSchedule);

module.exports = router;