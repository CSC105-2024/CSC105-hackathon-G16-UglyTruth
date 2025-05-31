import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to transcribe audio using Whisper API
async function transcribeAudio(audioFilePath) {
  try {
    console.log(`Transcribing audio file: ${audioFilePath}`);
    console.log(`Using Whisper model: whisper-1`);
    
    // Get file stats for debugging
    const stats = fs.statSync(audioFilePath);
    console.log(`File size: ${stats.size} bytes`);
    console.log(`File created at: ${stats.birthtime}`);
    console.log(`File permissions: ${stats.mode}`);
    
    // Start time for performance tracking
    const startTime = new Date();
    console.log(`Transcription started at: ${startTime.toISOString()}`);
    
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
    });
    
    // End time for performance tracking
    const endTime = new Date();
    const elapsedMs = endTime - startTime;
    console.log(`Transcription completed successfully in ${elapsedMs}ms`);
    console.log(`Transcription result: "${transcription.text}"`);
    console.log(`Transcription length: ${transcription.text.length} characters`);
    
    return transcription.text;
  } catch (error) {
    console.error("===== ERROR TRANSCRIBING AUDIO =====");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    console.error("=====================================");
    throw error;
  }
}

// Function to send transcript to ChatGPT and get a response
async function processTranscriptWithChatGPT(transcript) {
  try {
    console.log("===== SENDING TRANSCRIPT TO CHATGPT =====");
    console.log(`Transcript to categorize: "${transcript}"`);
    console.log(`Using model: gpt-4`);
    
    // Start time for performance tracking
    const startTime = new Date();
    console.log(`Categorization started at: ${startTime.toISOString()}`);
    
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "CAN YOU FKAONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD Love – dating, heartbreak, rejection, romantic struggles Family – conflicts, pressure, responsibilities Friends – betrayal, loneliness, social drama School – academics, teachers, peer pressure Work – job stress, coworkers, burnout Money – debt, bills, financial anxiety Health – physical or mental health struggles Society – injustice, politics, cultural pressure Internet – social media, online drama, tech fatigue Loss – grief, death, separation Self – identity crisis, low self-esteem, existential dread Other – for anything that doesn't fit neatly into the above. ONLY RESPOND WITH ONE WORD FROM THE CATEGORY NAME LIST ABOVE" },
        { role: "user", content: transcript }
      ],
    });
    
    // End time for performance tracking
    const endTime = new Date();
    const elapsedMs = endTime - startTime;
    
    const result = response.choices[0].message.content;
    console.log(`Categorization completed in ${elapsedMs}ms`);
    console.log(`Category result: "${result}"`);
    console.log("=========================================");
    
    return result;
  } catch (error) {
    console.error("===== ERROR PROCESSING WITH CHATGPT =====");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    console.error("=======================================");
    throw error;
  }
}

// Main function that processes an audio file and returns ChatGPT's response
async function processAudioWithAI(audioFilePath) {
  try {
    console.log("===== PROCESSING AUDIO WITH AI =====");
    console.log(`Audio file path: ${audioFilePath}`);
    console.log(`Processing started at: ${new Date().toISOString()}`);
    
    // Start time for performance tracking
    const startTime = new Date();
    
    // Step 1: Transcribe the audio to text
    console.log("--> Step 1: Transcribing audio");
    const transcript = await transcribeAudio(audioFilePath);
    
    // Step 2: Process the transcript with ChatGPT
    console.log("--> Step 2: Categorizing transcript");
    const response = await processTranscriptWithChatGPT(transcript);
    
    // End time for full processing
    const endTime = new Date();
    const elapsedMs = endTime - startTime;
    
    console.log(`===== PROCESSING COMPLETED =====`);
    console.log(`Total processing time: ${elapsedMs}ms`);
    console.log(`Final transcript: "${transcript}"`);
    console.log(`Final category: "${response}"`);
    console.log(`================================`);
    
    return {
      transcript,
      response
    };
  } catch (error) {
    console.error("===== ERROR IN OVERALL AUDIO PROCESSING =====");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    console.error("===========================================");
    throw error;
  }
}

// Example usage (uncomment and provide path to test)
// const audioPath = "./your-audio-file.mp3";
// processAudioWithAI(audioPath)
//   .then(result => console.log(result))
//   .catch(error => console.error("Failed:", error));

// Export functions for use in other files
export {
  transcribeAudio,
  processTranscriptWithChatGPT,
  processAudioWithAI
};