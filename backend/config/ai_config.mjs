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
    
    // THis is only here for debugging purposes
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
        { role: "system", content: "Read the following text and classify it into one of the following categories:\nLove, Family, Friends, School, Work, Money, Health, Society, Internet, Loss, Self, or Other.\n\nThen, determine if the content is severely disturbing (e.g. graphic descriptions of violence, self-harm, suicide, abuse, etc.).\n\nReply in JSON format with the following structure:\n\n{\n  \"category\": \"<category_name>\",\n  \"disturbing\": <true_or_false>\n}\n\nOnly respond with the JSON object—no explanations, no extra text." },
        { role: "user", content: transcript }
      ],
    });
    
    // End time for performance tracking
    const endTime = new Date();
    const elapsedMs = endTime - startTime;
    
    const result = response.choices[0].message.content;
    let parsedResult;
    try {
      // Clean the result to remove markdown formatting if present
      const cleanedResult = result.replace(/```json|```/g, '').trim();
      parsedResult = JSON.parse(cleanedResult);
      
      // Validate and normalize category
      const validCategories = ["Love", "Family", "Friends", "School", "Work", 
                               "Money", "Health", "Society", "Internet", "Loss", "Self"];
      
      // Case insensitive matching for categories
      const normalizedCategory = validCategories.find(
        cat => cat.toLowerCase() === parsedResult.category?.toLowerCase()
      );
      
      // If category is not valid, set to "Other"
      parsedResult.category = normalizedCategory || "Other";
      
      // Validate and normalize disturbing flag
      if (typeof parsedResult.disturbing !== "boolean") {
        console.log(`Invalid 'disturbing' value: ${parsedResult.disturbing}, defaulting to false`);
        parsedResult.disturbing = false;
      }
      
      console.log(`Categorization completed in ${elapsedMs}ms`);
      console.log(`Category result: "${parsedResult.category}", Disturbing: ${parsedResult.disturbing}`);
      console.log("=========================================");
      
      return parsedResult;
    } catch (error) {
      console.error("Failed to parse JSON response:", result);
      // Return a default object if parsing fails
      return {
        category: "Other",
        disturbing: false
      };
    }
  } catch (error) {
    console.error("===== ERROR PROCESSING WITH CHATGPT =====");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    console.error("=======================================");
    
    // Return a default object if API call fails
    return {
      category: "Other",
      disturbing: false
    };
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
    console.log(`Final category: "${response.category}", Disturbing: ${response.disturbing}`);
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