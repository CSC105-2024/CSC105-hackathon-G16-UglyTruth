import type { Context } from 'hono';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { processAudioWithAI } from '../config/ai_config.mjs';
export class AIController {
  static async transcribeAudio(c: Context) {
    try {
      // Get uploaded file
      const file = await c.req.formData();
      const audioFile = file.get('audio') as File;
      
      if (!audioFile) {
        return c.json({ 
          success: false, 
          message: 'No audio file uploaded' 
        }, 400);
      }
      
      // Create temp file
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `upload_${Date.now()}.${audioFile.name.split('.').pop()}`);
      
      // Write the file to disk
      const fileBuffer = await audioFile.arrayBuffer();
      fs.writeFileSync(tempFilePath, Buffer.from(fileBuffer));
      
      console.log(`Processing audio file: ${tempFilePath}`);
      console.log(`Audio file type: ${audioFile.type}`);
      console.log(`Audio file size: ${fileBuffer.byteLength} bytes`);
      
      // Process with OpenAI
      const result = await processAudioWithAI(tempFilePath);
      
      // Log detailed results
      console.log(`===== TRANSCRIPTION RESULTS =====`);
      console.log(`Raw transcript: "${result.transcript}"`);
      console.log(`Categorization result: "${result.response}"`);
      console.log(`=================================`);
      
      // Clean up temp file
      fs.unlinkSync(tempFilePath);
      console.log(`Temporary file deleted: ${tempFilePath}`);
      
      return c.json({
        success: true,
        transcript: result.transcript,
        response: result.response
      });
    } catch (error: unknown) {
      console.error('===== ERROR PROCESSING AUDIO =====');
      console.error('Error details:', error);
      
      // Handle the error safely with proper type checking
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      if (errorStack) {
        console.error('Stack trace:', errorStack);
      }
      console.error('Error message:', errorMessage);
      console.error('=================================');
      
      return c.json({ 
        success: false, 
        message: 'Error processing audio file',
        error: errorMessage
      }, 500);
    }
  }
}