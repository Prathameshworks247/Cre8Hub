// Test script to check transcript extraction with youtubei
const { Innertube } = require('youtubei');
const axios = require('axios');

async function testYoutubeiTranscript() {
  try {
    console.log("Testing transcript extraction with youtubei...");
    
    // Test with a known video that has captions
    const testVideoId = "dQw4w9WgXcQ"; // Rick Roll
    
    console.log(`Testing with video ID: ${testVideoId}`);
    
    // Initialize YouTube client
    const yt = await Innertube.create();
    console.log("✅ YouTube client initialized");
    
    // Get video info
    const video = await yt.getInfo(testVideoId);
    console.log("✅ Video info retrieved");
    
    if (video && video.captions) {
      console.log("✅ Captions found in video");
      console.log("Available caption tracks:", video.captions.player_tracked_rendition?.caption_tracks?.length || 0);
      
      // Try to get English captions first
      let captions = video.captions.player_tracked_rendition?.caption_tracks?.find(track => 
        track.language_code === 'en' || track.language_code === 'en-US'
      );
      
      // If no English, try to get any available captions
      if (!captions) {
        captions = video.captions.player_tracked_rendition?.caption_tracks?.[0];
      }
      
      if (captions && captions.base_url) {
        console.log(`✅ Found captions in language: ${captions.language_code}`);
        console.log("Caption URL:", captions.base_url);
        
        // Fetch the captions
        const response = await axios.get(captions.base_url);
        const captionsData = response.data;
        
        console.log("Raw captions data length:", captionsData.length);
        console.log("First 200 chars of raw data:", captionsData.substring(0, 200));
        
        // Parse captions (this is a simplified parser)
        const transcriptText = captionsData
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        console.log(`Processed transcript length: ${transcriptText.length} characters`);
        console.log("First 200 chars of processed text:", transcriptText.substring(0, 200));
        
      } else {
        console.log("❌ No caption tracks found");
      }
    } else {
      console.log("❌ No captions available for this video");
    }
    
  } catch (error) {
    console.error("❌ Transcript extraction failed:", error.message);
    console.error("Error details:", error);
  }
}

testYoutubeiTranscript();
