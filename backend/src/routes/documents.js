const express = require('express');
const {
  getDocuments,
  createDocument,
  deleteDocument
} = require('../controllers/documentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getDocuments);
router.post('/', createDocument);
router.delete('/:id', deleteDocument);

module.exports = router;