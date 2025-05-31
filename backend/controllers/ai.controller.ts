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
      
      // Process with OpenAI
      const result = await processAudioWithAI(tempFilePath);
      
      // Clean up temp file
      fs.unlinkSync(tempFilePath);
      
      return c.json({
        success: true,
        transcript: result.transcript,
        response: result.response
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      return c.json({ 
        success: false, 
        message: 'Error processing audio file' 
      }, 500);
    }
  }
}