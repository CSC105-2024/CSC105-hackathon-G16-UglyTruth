import type { Context } from 'hono';
import { PrismaClient } from '../src/generated/prisma/index.js';
import { processAudioWithAI } from '../config/ai_config.mjs';
const prisma = new PrismaClient();

export class PostController {

  private static formatPost(post: any, currentUserId?: number) {
    return {
      id: post.id.toString(),
      title: post.title,
      description: post.description,
      category: post.category,
      isAudio: post.isAudio || false,
      audioPath: post.audioPath || null,
      author: {
        id: post.author.id.toString(),
        email: post.author.email,
        createdAt: post.author.createdAt.toISOString()
      },
      relatableCount: post.relatableCount ?? post.relatables?.length ?? 0,
      views: post.views ?? 0,
      userRelated: currentUserId && post.relatables ? 
        post.relatables.some((rel: any) => rel.userId === currentUserId) : false,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  }

  static async createPost(c: Context) {
    try {
      let title = '';
      let description = '';
      let category = '';
      const user = c.get('user');
      let isAudio = false;
      let transcript = '';
      let audioPath = null;

      const contentType = c.req.header('content-type') || '';
      let audioFile: any;
      
      if (contentType.includes('multipart/form-data')) {
        // Handle audio upload
        const form = await c.req.formData();
        audioFile = form.get('audio');
        const titleEntry = form.get('title');
        if (typeof titleEntry === 'string') {
          title = titleEntry;
        } else {
          title = '';
        }
        
        if (!audioFile || typeof audioFile === 'string') {
          return c.json({ success: false, message: 'No audio file uploaded' }, 400);
        }
        
        // Save audio to temp file
        const os = await import('os');
        const path = await import('path');
        const fs = await import('fs');
        const fileName = audioFile.name || `audio_${Date.now()}.mp3`;
        const tempDir = os.default.tmpdir();
        const tempFilePath = path.default.join(tempDir, `upload_${Date.now()}.${fileName.split('.').pop()}`);
        const fileBuffer = Buffer.from(await audioFile.arrayBuffer());
        fs.default.writeFileSync(tempFilePath, fileBuffer);
        
        // Process audio: get transcript and category
        const aiResult = await processAudioWithAI(tempFilePath);
        transcript = aiResult.transcript;
        category = (aiResult.response || '').trim();
        description = transcript;
        
        // Clean up temp file
        fs.default.unlinkSync(tempFilePath);
        isAudio = true;
        
        // Create audio storage directory if it doesn't exist
        const audioDir = path.default.join(process.cwd(), 'audio_storage');
        if (!fs.default.existsSync(audioDir)) {
          fs.default.mkdirSync(audioDir, { recursive: true });
        }
        
        // Generate a unique filename for the audio file
        const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.mp3`;
        // Store only the filename in audioPath, not the full path
        audioPath = uniqueFilename;
        
      } else {
        // Handle JSON (text)
        const body = await c.req.json();
        title = body.title;
        description = body.description;
        if (!title || !description) {
          return c.json({ success: false, message: 'Missing required fields' }, 400);
        }
        const aiConfig = await import('../config/ai_config.mjs');
        const cat = await aiConfig.processTranscriptWithChatGPT(`${title} ${description}`);
        category = (cat || '').trim();
      }

      // Save post with determined category and audio path
      const post = await prisma.post.create({
        data: {
          title,
          description,
          category,
          isAudio,
          audioPath, // Save just the filename
          authorId: user.id
        },
        include: {
          author: true
        }
      });
      
      const formattedPost = PostController.formatPost(post);

      // If it's an audio post, store the audio file with the unique filename
      if (isAudio && audioFile) {
        const fs = await import('fs');
        const path = await import('path');
        
        try {
          // Save the audio file with the unique filename in audio_storage directory
          const fullAudioPath = path.default.join(process.cwd(), 'audio_storage', audioPath);
          const fileBuffer = Buffer.from(await audioFile.arrayBuffer());
          fs.default.writeFileSync(fullAudioPath, fileBuffer);
          console.log(`Audio saved successfully at ${fullAudioPath}`);
          
        } catch (err) {
          console.error('Error saving audio file:', err);
        }
      }

      return c.json({ success: true, post: formattedPost }, 201);
    } catch (error) {
      console.error('Error creating post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async getAllPosts(c: Context) {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true
        }
      });

      const formattedPosts = posts.map(post => PostController.formatPost(post));

      return c.json({ success: true, posts: formattedPosts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async getPostById(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      
      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true
        }
      });

      if (!post) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

      const formattedPost = PostController.formatPost(post);

      return c.json({ success: true, post: formattedPost });
    } catch (error) {
      console.error('Error fetching post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async getUserPosts(c: Context) {
    try {
      const userId = parseInt(c.req.param('userId'));
      
      if (isNaN(userId)) {
        return c.json({ success: false, message: 'Invalid user ID' }, 400);
      }

      const posts = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true
        }
      });

      const formattedPosts = posts.map(post => PostController.formatPost(post));

      return c.json({ success: true, posts: formattedPosts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async updatePost(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      const user = c.get('user');
      const { title, description } = await c.req.json();

      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }

      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

    

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          description
        },
        include: {
          author: true
        }
      });

      const formattedPost = PostController.formatPost(updatedPost);

      return c.json({ success: true, post: formattedPost });
    } catch (error) {
      console.error('Error updating post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async deletePost(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      const user = c.get('user');

      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }

      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

      if (post.authorId !== user.id) {
        return c.json({ success: false, message: 'You can only delete your own posts' }, 403);
      }

      await prisma.post.delete({
        where: { id: postId }
      });

      return c.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

static async relatePost(c: Context) {
  try {
    const postId = parseInt(c.req.param('id'));
    const user = c.get('user');

    if (isNaN(postId)) {
      return c.json({ success: false, message: 'Invalid post ID' }, 400);
    }
    if (!user) {
      return c.json({ success: false, message: 'Authentication required' }, 401);
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { relatables: true }
    });
    if (!post) {
      return c.json({ success: false, message: 'Post not found' }, 404);
    }

    const existingRelatable = await prisma.relatable.findUnique({
      where: { userId_postId: { userId: user.id, postId } }
    });

    let action: 'added' | 'removed';
    if (existingRelatable) {
      // Remove relatable (toggle off)
      await prisma.relatable.delete({
        where: { id: existingRelatable.id }
      });
      await prisma.post.update({
        where: { id: postId },
        data: { relatableCount: { decrement: 1 } }
      });
      action = 'removed';
    } else {
      // Add relatable
      await prisma.relatable.create({
        data: { userId: user.id, postId }
      });
      await prisma.post.update({
        where: { id: postId },
        data: { relatableCount: { increment: 1 } }
      });
      action = 'added';
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true, relatables: true }
    });
    if (!updatedPost) {
      return c.json({ success: false, message: 'Post not found' }, 404);
    }
    return c.json({
      success: true,
      action,
      data: PostController.formatPost(updatedPost, user.id)
    });
  } catch (error) {
    console.error('Error relating post:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
}

  static async searchPosts(c: Context) {
    try {
      const query = c.req.query('q') || '';
      let whereCondition: any = {};
      
      // If there's a search query, add the search conditions
      if (query && query.trim() !== '') {
        whereCondition.OR = [
          { title: { contains: query } },
          { description: { contains: query } }
        ];
      }
      
      const posts = await prisma.post.findMany({
        where: whereCondition,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: true
        }
      });

      // Format the posts before returning
      const formattedPosts = posts.map(post => PostController.formatPost(post));

      return c.json({ success: true, data: formattedPosts });
    } catch (error) {
      console.error('Error searching posts:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  static async incrementViewCount(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      
      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }

      // Increment view count
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { 
          views: { increment: 1 } 
        },
        include: {
          author: true,
          relatables: true
        }
      });

      const user = c.get('user');
      const userId = user ? user.id : undefined;
      const formattedPost = PostController.formatPost(updatedPost, userId);

      return c.json({
        success: true,
        data: formattedPost
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }  static async getPostAudio(c: Context) {
    try {
      const postId = parseInt(c.req.param('id'));
      
      if (isNaN(postId)) {
        return c.json({ success: false, message: 'Invalid post ID' }, 400);
      }
      
      const post = await prisma.post.findUnique({
        where: { id: postId }
      });
      
      if (!post || !post.isAudio) {
        return c.json({ success: false, message: 'Audio not found' }, 404);
      }
      
      if (post.audioPath) {
        // Return the filename directly
        return c.json({ 
          success: true, 
          filename: post.audioPath 
        });
      } else {
        // No audio path available
        return c.json({ success: false, message: 'Audio file information not found' }, 404);
      }
    } catch (error) {
      console.error('Error retrieving post audio:', error);
      return c.json({ success: false, message: 'Internal server error' }, 500);
    }
  }
  
  private static async getAllPostsInternal() {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });
    return posts.map(post => PostController.formatPost(post));
  }
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
