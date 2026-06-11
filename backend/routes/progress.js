const express = require('express');
const router = express.Router();
const { getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getProgress)
  .put(protect, updateProgress);

module.exports = router;
