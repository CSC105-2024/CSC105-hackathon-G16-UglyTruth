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
    
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
    });
    
    console.log("Transcription completed successfully");
    return transcription.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
}

// Function to send transcript to ChatGPT and get a response
async function processTranscriptWithChatGPT(transcript) {
  try {
    console.log("Sending transcript to ChatGPT");
    
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "CAN YOU FKAONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD ONLY REPLY WITH THE CATEGORY NAME< NOTHING ELSE NOTHIONG NOTHOLEM PLS GOD Love – dating, heartbreak, rejection, romantic struggles Family – conflicts, pressure, responsibilities Friends – betrayal, loneliness, social drama School – academics, teachers, peer pressure Work – job stress, coworkers, burnout Money – debt, bills, financial anxiety Health – physical or mental health struggles Society – injustice, politics, cultural pressure Internet – social media, online drama, tech fatigue Loss – grief, death, separation Self – identity crisis, low self-esteem, existential dread Other – for anything that doesn’t fit neatly into the above. ONLY RESPOND WITH ONE WORD FROM THE CATEGORY NAME LIST ABOVE" },
        { role: "user", content: transcript }
      ],
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error processing with ChatGPT:", error); 
    throw error;
  }
}

// Main function that processes an audio file and returns ChatGPT's response
async function processAudioWithAI(audioFilePath) {
  try {
    // Step 1: Transcribe the audio to text
    const transcript = await transcribeAudio(audioFilePath);
    console.log("Transcript:", transcript);
    
    // Step 2: Process the transcript with ChatGPT
    const response = await processTranscriptWithChatGPT(transcript);
    console.log("ChatGPT Response:", response);
    
    return {
      transcript,
      response
    };
  } catch (error) {
    console.error("Error processing audio with AI:", error);
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