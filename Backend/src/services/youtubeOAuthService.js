const axios = require('axios');
const User = require('../models/userModel');
const redis = require('../utils/redis');

// Constants
const CACHE_EXPIRY = 86400; // 24 hours
const DEFAULT_MAX_VIDEOS = 10;
const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || "http://localhost:8000";

// Extract persona from user's own YouTube channel using OAuth
exports.extractPersonaFromUserChannel = async (userId, maxVideos = DEFAULT_MAX_VIDEOS) => {
  try {
    console.log(`🎬 Starting OAuth-based persona extraction for user ${userId}`);
    
    // Get user with OAuth tokens (need to explicitly select them)
    const user = await User.findById(userId).select('+youtubeTokens.accessToken +youtubeTokens.refreshToken +youtubeTokens.expiresAt +youtubeTokens.isConnected');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.youtubeTokens.isConnected) {
      throw new Error('YouTube account not connected. Please connect your YouTube account first.');
    }
    
    if (!user.isYouTubeTokenValid()) {
      throw new Error('YouTube token expired. Please reconnect your account.');
    }
    
    const accessToken = user.youtubeTokens.accessToken;
    
    // Step 1: Get user's channel info
    const channelInfo = await exports.getUserChannelInfo(accessToken);
    console.log(`📺 Found channel: ${channelInfo.title} (${channelInfo.id})`);
    
    // Step 2: Get user's recent videos
    const videos = await exports.getUserVideos(accessToken, channelInfo.uploadsPlaylistId, maxVideos);
    console.log(`📹 Found ${videos.length} videos to process`);
    
    if (videos.length === 0) {
      throw new Error('No videos found in your channel');
    }
    
    // Step 3: Extract transcripts for each video
    const transcripts = [];
    for (const video of videos) {
      try {
        const transcript = await exports.getVideoTranscriptWithOAuth(video.id, accessToken);
        if (transcript) {
          transcripts.push({
            videoId: video.id,
            title: video.title,
            transcript: transcript,
            publishedAt: video.publishedAt
          });
          
          // Cache transcript in Redis
          await exports.cacheTranscript(userId, video.id, transcript);
        }
      } catch (error) {
        console.warn(`⚠️ Could not get transcript for video ${video.id}:`, error.message);
      }
    }
    
    if (transcripts.length === 0) {
      throw new Error('No transcripts found for your videos');
    }
    
    console.log(`✅ Extracted ${transcripts.length} transcripts`);
    
    // Step 4: Send to AI for persona extraction
    const personaData = await exports.triggerPersonaExtraction(userId);
    
    // Step 5: Update user metadata
    await exports.updateUserMetadata(userId, {
      videosProcessed: transcripts.length,
      lastExtraction: new Date(),
      extractionMethod: 'oauth_transcripts'
    });
    
    return {
      success: true,
      message: 'Persona extracted successfully from your YouTube channel',
      channelInfo: {
        id: channelInfo.id,
        title: channelInfo.title,
        subscriberCount: channelInfo.subscriberCount
      },
      videosProcessed: transcripts.length,
      persona: personaData
    };
    
  } catch (error) {
    console.error('❌ OAuth persona extraction error:', error);
    throw error;
  }
};

// Get user's YouTube channel information
exports.getUserChannelInfo = async (accessToken) => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    if (response.data.items.length === 0) {
      throw new Error('No channel found for this user');
    }
    
    const channel = response.data.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
      videoCount: parseInt(channel.statistics.videoCount) || 0,
      viewCount: parseInt(channel.statistics.viewCount) || 0,
      uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads
    };
  } catch (error) {
    console.error('Error getting channel info:', error);
    throw new Error('Failed to get channel information');
  }
};

// Get user's videos from their uploads playlist
exports.getUserVideos = async (accessToken, uploadsPlaylistId, maxVideos) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsPlaylistId}&part=snippet&maxResults=${maxVideos}&order=date`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    return response.data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.default.url
    }));
  } catch (error) {
    console.error('Error getting user videos:', error);
    throw new Error('Failed to get user videos');
  }
};

// Get video transcript using OAuth
exports.getVideoTranscriptWithOAuth = async (videoId, accessToken) => {
  try {
    console.log(`📝 Attempting to get transcript for video: ${videoId}`);
    
    // Get captions list for the video
    const captionsResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&part=snippet`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    if (captionsResponse.data.items.length === 0) {
      console.log(`⚠️ No captions available for video ${videoId}`);
      return null;
    }
    
    // Find the best caption track (prefer auto-generated English)
    let bestCaption = captionsResponse.data.items.find(item => 
      item.snippet.language === 'en' && item.snippet.trackKind === 'asr'
    );
    
    if (!bestCaption) {
      bestCaption = captionsResponse.data.items[0];
    }
    
    // Download the transcript
    const transcriptResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions/${bestCaption.id}?tfmt=srt`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'text'
      }
    );
    
    // Parse SRT format to plain text
    const transcript = exports.parseSRTTranscript(transcriptResponse.data);
    console.log(`✅ Successfully extracted transcript for ${videoId} (${transcript.length} chars)`);
    
    return transcript;
    
  } catch (error) {
    console.error(`❌ Error getting transcript for ${videoId}:`, error.message);
    return null;
  }
};

// Parse SRT transcript format to plain text
exports.parseSRTTranscript = (srtContent) => {
  try {
    // Remove SRT formatting and extract just the text
    const lines = srtContent.split('\n');
    const textLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines, timestamps, and sequence numbers
      if (line && 
          !line.match(/^\d+$/) && // Not a sequence number
          !line.match(/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/) && // Not a timestamp
          !line.match(/^\d{2}:\d{2}:\d{2},\d{3}$/)) { // Not a single timestamp
        textLines.push(line);
      }
    }
    
    return textLines.join(' ').trim();
  } catch (error) {
    console.error('Error parsing SRT transcript:', error);
    return srtContent; // Return raw content if parsing fails
  }
};

// Cache transcript in Redis
exports.cacheTranscript = async (userId, videoId, transcript) => {
  try {
    const key = `transcript:${userId}:${videoId}`;
    await redis.setex(key, CACHE_EXPIRY, transcript);
    console.log(`✅ Cached transcript for ${videoId} (${transcript.length} chars)`);
  } catch (error) {
    console.error('Error caching transcript:', error);
  }
};

// Get cached transcripts from Redis
exports.getCachedTranscripts = async (userId) => {
  try {
    const pattern = `transcript:${userId}:*`;
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return [];
    }
    
    const transcripts = [];
    for (const key of keys) {
      const transcript = await redis.get(key);
      if (transcript) {
        const videoId = key.split(':')[2];
        transcripts.push({
          videoId,
          transcript
        });
      }
    }
    
    return transcripts;
  } catch (error) {
    console.error('Error getting cached transcripts:', error);
    return [];
  }
};

// Trigger AI persona extraction
exports.triggerPersonaExtraction = async (userId) => {
  try {
    console.log(`🤖 Triggering AI persona extraction for user ${userId}`);
    
    const response = await axios.post(
      `${FASTAPI_BASE_URL}/persona/${userId}`,
      {},
      {
        timeout: 300000, // 5 minute timeout for AI processing
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log(`✅ Persona extraction successful for user ${userId}`);
    return response.data;
    
  } catch (error) {
    console.error('❌ AI persona extraction error:', error);
    throw new Error('Failed to extract persona with AI');
  }
};

// Update user metadata
exports.updateUserMetadata = async (userId, metadata) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $set: {
        'youtubeTokens.lastExtraction': new Date(),
        ...metadata
      }
    });
  } catch (error) {
    console.error('Error updating user metadata:', error);
  }
};

// Send cached transcripts to AI and save persona
exports.sendToAIAndSave = async (userId, transcripts) => {
  try {
    console.log(`🤖 Sending ${transcripts.length} cached transcripts to AI for user ${userId}`);
    const personaData = await exports.triggerPersonaExtraction(userId);
    await exports.updateUserMetadata(userId, {
      videosProcessed: transcripts.length,
      lastExtraction: new Date(),
      extractionMethod: 'cached_transcripts'
    });
    return personaData;
  } catch (error) {
    console.error('Error sending to AI:', error);
    throw error;
  }
};
