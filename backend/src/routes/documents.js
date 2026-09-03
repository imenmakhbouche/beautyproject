const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const {
  getDocuments,
  createDocument,
  deleteDocument
} = require('../controllers/documentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({ storage });

router.use(auth);

router.get('/', getDocuments);
// Accept multipart/form-data with optional file field named 'file'
router.post('/', upload.single('file'), createDocument);
router.delete('/:id', deleteDocument);

module.exports = router;