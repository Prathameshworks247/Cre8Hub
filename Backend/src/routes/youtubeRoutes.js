const express = require('express');
const youtubeController = require('../controllers/youtubeController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// YouTube persona extraction routes (require authentication)
router.post('/extract-persona', authenticateToken, youtubeController.extractPersona);
router.post('/extract-persona-channel', authenticateToken, youtubeController.extractPersonaFromChannel);
router.post('/manual-persona', authenticateToken, youtubeController.manualPersonaInput);

module.exports = router;
