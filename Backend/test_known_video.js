// Test script with a known video that has English transcripts
const { YoutubeTranscript } = require('youtube-transcript');

async function testKnownVideo() {
  try {
    console.log("Testing with a known video that has English transcripts...");
    
    // Test with a popular video that definitely has English transcripts
    const testVideoId = "dQw4w9WgXcQ"; // Rick Roll - has English transcripts
    
    console.log(`Testing with video ID: ${testVideoId}`);
    
    const transcript = await YoutubeTranscript.fetchTranscript(testVideoId, {
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
    console.error("❌ Transcript extraction failed:", error.message);
    
    // Try without language specification
    try {
      console.log("Trying without language specification...");
      const transcript = await YoutubeTranscript.fetchTranscript(testVideoId);
      
      if (transcript && transcript.length > 0) {
        console.log("✅ Success with no language specification!");
        console.log(`Found ${transcript.length} transcript segments`);
      }
    } catch (error2) {
      console.error("❌ Also failed without language specification:", error2.message);
    }
  }
}

testKnownVideo();
