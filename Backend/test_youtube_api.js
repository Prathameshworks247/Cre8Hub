// Test script to check transcript extraction using YouTube Data API v3
const axios = require('axios');

async function testYouTubeAPITranscript() {
  try {
    console.log("Testing transcript extraction using YouTube Data API v3...");
    
    const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyDqPBNzEOLBRtQg3bIxlnEO22jqM0lPe6I";
    const testVideoId = "dQw4w9WgXcQ"; // Rick Roll
    
    console.log(`Testing with video ID: ${testVideoId}`);
    
    // Get captions using YouTube Data API v3
    const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?key=${apiKey}&videoId=${testVideoId}&part=snippet`;
    console.log("Fetching captions list...");
    
    const captionsResponse = await axios.get(captionsUrl);
    console.log("Captions response:", captionsResponse.data);
    
    if (captionsResponse.data.items && captionsResponse.data.items.length > 0) {
      console.log(`Found ${captionsResponse.data.items.length} caption tracks`);
      
      // Find English captions first
      let captionId = captionsResponse.data.items.find(item => 
        item.snippet.language === 'en' || item.snippet.language === 'en-US'
      )?.id;
      
      // If no English, use any available captions
      if (!captionId) {
        captionId = captionsResponse.data.items[0].id;
      }
      
      if (captionId) {
        console.log(`Using caption ID: ${captionId}`);
        
        // Download the caption track
        const downloadUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}&tfmt=srt`;
        console.log("Downloading captions...");
        
        const captionResponse = await axios.get(downloadUrl);
        const srtContent = captionResponse.data;
        
        console.log("Raw SRT content length:", srtContent.length);
        console.log("First 200 chars of SRT:", srtContent.substring(0, 200));
        
        // Parse SRT format captions
        const transcriptText = srtContent
          .replace(/\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n/g, '') // Remove SRT timestamps
          .replace(/\n/g, ' ') // Replace newlines with spaces
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        console.log(`Processed transcript length: ${transcriptText.length} characters`);
        console.log("First 200 chars of processed text:", transcriptText.substring(0, 200));
        
        if (transcriptText && transcriptText.length > 0) {
          console.log("✅ Successfully extracted transcript using YouTube Data API!");
        } else {
          console.log("❌ No transcript text after processing");
        }
      } else {
        console.log("❌ No caption ID found");
      }
    } else {
      console.log("❌ No captions available for this video");
    }
    
  } catch (error) {
    console.error("❌ Transcript extraction failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testYouTubeAPITranscript();
