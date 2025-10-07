const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');
const { authenticateToken } = require('../middleware/auth');

// OAuth routes for YouTube integration
router.get('/youtube/auth-url', authenticateToken, oauthController.getAuthUrl);
router.get('/youtube/callback', oauthController.handleCallback);
router.get('/youtube/status', authenticateToken, oauthController.getConnectionStatus);
router.post('/youtube/disconnect', authenticateToken, oauthController.disconnectYouTube);
router.post('/youtube/refresh-token', authenticateToken, oauthController.refreshToken);

module.exports = router;
