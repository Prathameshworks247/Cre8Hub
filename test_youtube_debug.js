const axios = require("axios");

async function testYouTubeAPI() {
  try {
    console.log("🔍 Testing YouTube API...");
    
    const apiKey = "AIzaSyDqPBNzEOLBRtQg3bIxlnEO22jqM0lPe6I";
    const channelId = "mkbhd";
    
    // Test channel lookup
    console.log("📺 Testing channel lookup...");
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&forUsername=${channelId}&part=contentDetails`;
    const channelResponse = await axios.get(channelUrl);
    
    console.log("✅ Channel found:", channelResponse.data.items[0].id);
    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    console.log("📋 Uploads playlist:", uploadsPlaylistId);
    
    // Test playlist items
    console.log("🎬 Testing playlist items...");
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=contentDetails&maxResults=3&order=date`;
    const playlistResponse = await axios.get(playlistUrl);
    
    console.log("✅ Found videos:", playlistResponse.data.items.length);
    const videoIds = playlistResponse.data.items.map(item => item.contentDetails.videoId);
    console.log("🎥 Video IDs:", videoIds);
    
    // Test mock transcript
    console.log("📝 Testing mock transcript...");
    const mockTranscript = `
      Hey everyone, welcome back to the channel! Today we're going to be talking about the latest tech trends and how they're shaping our future. 
      I'm really excited to share some insights about artificial intelligence and machine learning that I've been researching lately.
      The technology landscape is changing so rapidly, and it's important for us to stay informed about these developments.
      I've been testing out some new gadgets and software, and I want to share my honest thoughts with you all.
      The user experience has really improved over the past year, and I think we're seeing some really innovative solutions.
      Let me know in the comments what you think about these trends, and don't forget to subscribe for more content like this.
      Thanks for watching, and I'll see you in the next video!
    `.trim();
    
    console.log("✅ Mock transcript length:", mockTranscript.length);
    console.log("🎯 Mock transcript preview:", mockTranscript.substring(0, 100) + "...");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testYouTubeAPI();

