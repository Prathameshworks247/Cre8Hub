// youtubeController.js
const youtubeService = require("../services/youtubeService");
const Redis = require("ioredis");

// Mandatory Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

/**
 * Auto persona extraction from YouTube
 */
exports.extractPersona = async (req, res) => {
  try {
    const { userId, channelId } = req.body;

    if (!userId || !channelId) {
      return res.status(400).json({ message: "userId and channelId required" });
    }

    // 🔍 Step 1: Check if transcripts are still cached in Redis
    const keys = await redis.keys(`transcript:${userId}:*`);
    let transcripts = [];

    if (keys.length > 0) {
      console.log("✅ Using cached transcripts from Redis");
      for (let key of keys) {
        const transcriptText = await redis.get(key);
        const videoId = key.split(":")[2]; // extract videoId from key
        transcripts.push({ videoId, transcript: transcriptText });
      }

      // Send cached transcripts directly to AI model
      const personaData = await youtubeService.sendToAIAndSave(userId, transcripts);

      return res.status(200).json({
        message: "Persona extracted from cached transcripts and saved successfully",
        persona: personaData,
      });
    }

    // 🔁 Step 2: Otherwise fetch from YouTube + process via service
    const personaData = await youtubeService.extractPersonaFromChannel(userId, channelId);

    res.status(200).json({
      message: "Persona extracted and saved successfully",
      persona: personaData,
    });
  } catch (error) {
    console.error("❌ Error in extractPersona:", error.message);
    res.status(500).json({ message: "Failed to extract persona", error: error.message });
  }
};

/**
 * Manual persona input
 */
exports.manualPersonaInput = async (req, res) => {
  try {
    const { userId, persona } = req.body;

    if (!userId || !persona) {
      return res.status(400).json({ message: "userId and persona required" });
    }

    const personaData = await youtubeService.saveManualPersona(userId, persona);

    res.status(200).json({
      message: "Manual persona saved successfully",
      persona: personaData,
    });
  } catch (error) {
    console.error("❌ Error in manualPersonaInput:", error.message);
    res.status(500).json({ message: "Failed to save manual persona", error: error.message });
  }
};