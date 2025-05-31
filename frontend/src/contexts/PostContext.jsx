import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Axios } from '../axiosinstance'; // Use correct casing for import

// Create the context
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await Axios.get('/posts');
      if (data.success) {
        setPosts(data.posts);
      } else {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
      setIsLoading(false);
    }
  }, []);

  const fetchUserPosts = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await Axios.get(`/users/${userId}/posts`);
      if (data.success) {
        setUserPosts(data.posts);
      } else {
        throw new Error(data.message || 'Failed to fetch user posts');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user posts');
      setIsLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    setCurrentPost(null);
    try {
      const { data } = await Axios.get(`/posts/${id}`);
      if (data.success) {
        setCurrentPost(data.post);
      } else {
        throw new Error(data.message || 'Post not found');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch post');
      setIsLoading(false);
    }
  }, []);  const createPost = useCallback(async (postData, isAudioUpload = false) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }
      
      let response;
      if (isAudioUpload) {
        // Handle audio upload (FormData)
        if (!(postData instanceof FormData)) {
          throw new Error('Audio upload requires FormData');
        }
        // The server will process the audio, extract transcript and determine category
        response = await Axios.post('/posts', postData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Handle regular JSON post
        // The server will use the title and description to determine the category
        const requestData = {
          title: postData.title,
          description: postData.description
        };
        response = await Axios.post('/posts', requestData);
      }
      
      const { data } = response;
      if (!data.success) {
        throw new Error(data.message || 'Failed to create post');
      }
      
      // Add the new post to the state and refresh posts
      setPosts(prevPosts => [data.post, ...prevPosts]);
      setIsLoading(false);
      return data.post;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create post');
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  const updatePost = useCallback(async (id, postData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to update a post');
      }
      const requestData = {
        title: postData.title,
        description: postData.description,
        category: postData.category || 'other',
        warning: !!postData.warning,
        imageUrl: postData.imageUrl || '',
      };
      const { data } = await Axios.put(`/posts/${id}`, requestData);
      if (!data.success) {
        throw new Error(data.message || 'Failed to update post');
      }
      setPosts(prevPosts => prevPosts.map(p => p.id === id ? data.post : p));
      setCurrentPost(data.post);
      setIsLoading(false);
      return data.post;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update post');
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  const deletePost = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to delete a post');
      }
      const { data } = await Axios.delete(`/posts/${id}`);
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete post');
      }
      setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
      setUserPosts(prevPosts => prevPosts.filter(p => p.id !== id));
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete post');
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  // Relatable logic (toggle)
  const toggleRelatable = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to mark relatable');
      }
      const { data } = await Axios.post(`/posts/${id}/relatable`);
      if (!data.success) {
        throw new Error(data.message || 'Failed to mark relatable');
      }
      const updatedPost = data.post;
      setPosts(prevPosts => prevPosts.map(p => p.id === id ? updatedPost : p));
      if (currentPost?.id === id) {
        setCurrentPost(updatedPost);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark relatable');
      setIsLoading(false);
    }
  }, [user, currentPost]);
  // Search posts function
  const searchPosts = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await Axios.get(`/posts/search?q=${encodeURIComponent(query)}`);
      if (data.success) {
        setPosts(data.data || []);
      } else {
        throw new Error(data.message || 'Search failed');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search posts');
      setIsLoading(false);
    }
  }, []);

  const value = {
    posts,
    userPosts,
    currentPost,
    isLoading,
    error,
    fetchPosts,
    fetchUserPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    toggleRelatable,
    searchPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};