// youtubeService.js
const axios = require("axios");
const { getSubtitles } = require("youtube-captions-scraper");
const User = require("../models/userModel");
const Redis = require("ioredis");

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

exports.extractPersonaFromChannel = async (userId, channelId, maxVideos = 5) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&maxResults=${maxVideos}`;

    // Step 1: Get video IDs
    const { data } = await axios.get(searchUrl);
    const videoIds = data.items.map(item => item.id.videoId).filter(Boolean);

    // Step 2: Ensure transcripts are cached in Redis (1-day expiry)
    for (let videoId of videoIds) {
      const cacheKey = `transcript:${userId}:${videoId}`;
      const alreadyCached = await redis.get(cacheKey);
      if (alreadyCached) continue;
      try {
        const caption = await getSubtitles({ videoID: videoId, lang: "en" });
        const transcriptText = caption.map(line => line.text).join(" ");
        await redis.setex(cacheKey, 86400, transcriptText);
      } catch (err) {
        console.warn(`⚠️ No transcript for video: ${videoId}`);
        continue;
      }
    }

    // Step 3: Read transcripts back from Redis and send to AI
    const transcripts = await exports.getCachedTranscripts(userId);
    return await exports.sendToAIAndSave(userId, transcripts);
  } catch (error) {
    console.error("❌ Error in extractPersonaFromChannel:", error.message);
    throw new Error("Failed to extract persona from YouTube");
  }
};

/**
 * Send cached transcripts to AI and save persona
 */
exports.sendToAIAndSave = async (userId, transcripts) => {
  try {
    // Step 1: Send transcripts to AI model
    const aiResponse = await axios.post("http://localhost:8000/extract_persona", {
      transcripts,
    });
    const personaData = aiResponse.data;

    // Step 2: Save persona in MongoDB
    await User.findByIdAndUpdate(userId, { persona: personaData });

    return personaData;
  } catch (error) {
    console.error("❌ Error in sendToAIAndSave:", error.message);
    throw new Error("Failed to process transcripts with AI");
  }
};

// Helper: Get all cached transcripts for a user from Redis
exports.getCachedTranscripts = async (userId) => {
  const keys = await redis.keys(`transcript:${userId}:*`);
  const transcripts = [];
  for (const key of keys) {
    const transcriptText = await redis.get(key);
    const videoId = key.split(":")[2];
    transcripts.push({ videoId, transcript: transcriptText });
  }
  return transcripts;
};

// Helper: Cache transcripts for recent videos
exports.cacheTranscripts = async (userId, channelId, maxVideos = 5) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&maxResults=${maxVideos}`;
  const { data } = await axios.get(searchUrl);
  const videoIds = data.items.map(item => item.id.videoId).filter(Boolean);

  for (let videoId of videoIds) {
    const cacheKey = `transcript:${userId}:${videoId}`;
    const exists = await redis.get(cacheKey);
    if (exists) continue;
    try {
      const caption = await getSubtitles({ videoID: videoId, lang: "en" });
      const transcriptText = caption.map(line => line.text).join(" ");
      await redis.setex(cacheKey, 86400, transcriptText);
    } catch (err) {
      console.warn(`⚠️ No transcript for video: ${videoId}`);
    }
  }
};

/**
 * Manual persona input
 */
exports.saveManualPersona = async (userId, persona) => {
  try {
    await User.findByIdAndUpdate(userId, { persona });
    return persona;
  } catch (error) {
    console.error("❌ Error in saveManualPersona:", error.message);
    throw new Error("Failed to save manual persona");
  }
};