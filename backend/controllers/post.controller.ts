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
    author: {
      id: post.author.id.toString(),
      email: post.author.email,
      createdAt: post.author.createdAt.toISOString()
    },
    relatableCount: post.relatableCount ?? post.relatables?.length ?? 0,
    views: post.views ?? 0, // Make sure views is included
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

      const contentType = c.req.header('content-type') || '';
      if (contentType.includes('multipart/form-data')) {
        // Handle audio upload
        const form = await c.req.formData();
        const audioFile = form.get('audio');
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

      // Save post with determined category
      const post = await prisma.post.create({
        data: {
          title,
          description,
          category,
          authorId: user.id
        },
        include: {
          author: true
        }
      });
      const formattedPost = PostController.formatPost(post);
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

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { views: { increment: 1 } },
        include: { author: true, relatables: true }
      });

      if (!updatedPost) {
        return c.json({ success: false, message: 'Post not found' }, 404);
      }

      const user = c.get('user');
      const userId = user ? user.id : undefined;
      
      return c.json({
        success: true,
        data: PostController.formatPost(updatedPost, userId)
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
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
  await prisma.$disconnect()
})
