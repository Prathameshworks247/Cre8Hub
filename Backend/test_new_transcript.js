// Test script to check new transcript extraction with youtube-transcript
const { YoutubeTranscript } = require('youtube-transcript');

async function testNewTranscriptExtraction() {
  try {
    console.log("Testing new transcript extraction with youtube-transcript...");
    
    // Test with a recent MKBHD video ID
    const mkbhdVideoId = "N22ha1oexEc";
    
    console.log(`Testing with MKBHD video ID: ${mkbhdVideoId}`);
    
    const transcript = await YoutubeTranscript.fetchTranscript(mkbhdVideoId, {
      lang: 'en',
      country: 'US'
    });
    
    if (transcript && transcript.length > 0) {
      console.log("✅ New transcript extraction working!");
      console.log(`Found ${transcript.length} transcript segments`);
      console.log("First few segments:", transcript.slice(0, 3));
      
      // Test the transcript text processing
      const transcriptText = transcript
        .map(item => item.text.trim())
        .filter(text => text.length > 0)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
        
      console.log(`Processed transcript length: ${transcriptText.length} characters`);
      console.log("First 200 chars:", transcriptText.substring(0, 200));
      
    } else {
      console.log("❌ No transcript found for this video");
    }
    
  } catch (error) {
    console.error("❌ New transcript extraction failed:", error.message);
    console.error("Error details:", error);
  }
}

testNewTranscriptExtraction();
