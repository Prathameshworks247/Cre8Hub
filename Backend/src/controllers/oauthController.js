const axios = require('axios');
const User = require('../models/userModel');
const jwt = require('../utils/jwt');

// Generate OAuth authorization URL
exports.getAuthUrl = (req, res) => {
  try {
    const { userId } = req.user; // From auth middleware
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const scope = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${userId}`; // Include user ID in state for security
    
    res.json({
      success: true,
      authUrl,
      message: 'OAuth authorization URL generated'
    });
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate OAuth URL',
      error: error.message
    });
  }
};

// Handle OAuth callback
exports.handleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code not provided'
      });
    }
    
    // Verify state parameter matches user ID
    const userId = state;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state parameter'
      });
    }
    
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });
    
    const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;
    
    // Find user and store tokens
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Store tokens securely
    await user.storeYouTubeTokens({
      access_token,
      refresh_token,
      expires_in,
      scope
    });
    
    // Get user's YouTube channel info
    const channelResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true',
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );
    
    const channelInfo = channelResponse.data.items[0];
    const channelId = channelInfo.id;
    const channelTitle = channelInfo.snippet.title;
    
    res.json({
      success: true,
      message: 'YouTube account connected successfully',
      channelInfo: {
        channelId,
        title: channelTitle,
        connectedAt: user.youtubeTokens.connectedAt
      }
    });
    
  } catch (error) {
    console.error('OAuth callback error:', error.response?.data || error.message);
    
    // Check if it's a redirect_uri_mismatch or invalid_grant error
    const errorDetail = error.response?.data?.error_description || error.response?.data?.error || error.message;
    
    res.status(500).json({
      success: false,
      message: 'Failed to connect YouTube account',
      error: errorDetail,
      details: error.response?.data
    });
  }
};

// Get user's YouTube connection status
exports.getConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const user = await User.findById(userId).select('youtubeTokens');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const isConnected = user.youtubeTokens.isConnected;
    const isValid = user.isYouTubeTokenValid();
    
    res.json({
      success: true,
      connected: isConnected,
      valid: isValid,
      connectedAt: user.youtubeTokens.connectedAt,
      expiresAt: user.youtubeTokens.expiresAt
    });
    
  } catch (error) {
    console.error('Error getting connection status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get connection status',
      error: error.message
    });
  }
};

// Disconnect YouTube account
exports.disconnectYouTube = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.disconnectYouTube();
    
    res.json({
      success: true,
      message: 'YouTube account disconnected successfully'
    });
    
  } catch (error) {
    console.error('Error disconnecting YouTube:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect YouTube account',
      error: error.message
    });
  }
};

// Refresh YouTube access token
exports.refreshToken = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.youtubeTokens.refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'No refresh token available'
      });
    }
    
    // Refresh the token with Google
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: user.youtubeTokens.refreshToken,
      grant_type: 'refresh_token'
    });
    
    const { access_token, expires_in } = tokenResponse.data;
    
    // Update the access token
    user.youtubeTokens.accessToken = access_token;
    user.youtubeTokens.expiresAt = new Date(Date.now() + (expires_in * 1000));
    await user.save();
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      expiresAt: user.youtubeTokens.expiresAt
    });
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    });
  }
};
