import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Axios } from '../axiosinstance';
import { useAuth } from './AuthContext';

// Create the context
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Add state to track viewed posts IDs
  const [viewedPostIds, setViewedPostIds] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('viewedPostIds');
    return saved ? JSON.parse(saved) : [];
  });

  // Save viewed posts to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('viewedPostIds', JSON.stringify(viewedPostIds));
  }, [viewedPostIds]);

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
        
        // We don't need to pre-check audio here anymore
        // The individual PostCard component will handle loading the audio
        
      } else {
        throw new Error(data.message || 'Post not found');
      }
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch post');
      setIsLoading(false);
    }
  }, []);
  const createPost = useCallback(async (postData, isAudioUpload = false) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }
      
      let response;
      if (isAudioUpload) {
        if (!(postData instanceof FormData)) {
          throw new Error('Audio upload requires FormData');
        }
        // Make sure FormData includes the isPublic property
        if (!postData.has('isPublic')) {
          postData.append('isPublic', false);
        }
        response = await Axios.post('/posts', postData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        const requestData = {
          title: postData.title,
          description: postData.description,
          isPublic: postData.isPublic !== undefined ? postData.isPublic : false
        };
        response = await Axios.post('/posts', requestData);
      }
      
      const { data } = response;
      if (!data.success) {
        throw new Error(data.message || 'Failed to create post');
      }
      
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
  const toggleRelatable = async (id) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to mark relatable');
      }
      
      const { data } = await Axios.post(`/posts/${id}/relatable`);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to mark relatable');
      }
      
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id ? {
          ...post,
          relatableCount: data.data.relatableCount,
          userRelated: !post.userRelated
        } : post
      ));
      
    } catch (error) {
      console.error('Error toggling relatable:', error);
    }
  };

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

  // Update incrementViewCount function to also mark post as viewed
  const incrementViewCount = async (id) => {
    try {
      if (!id) return;
      
      // Add to viewed posts if not already there
      if (!viewedPostIds.includes(id)) {
        setViewedPostIds(prev => [...prev, id]);
      }
      
      const { data } = await Axios.post(`/posts/${id}/view`);
      
      if (!data.success) {
        console.error(data.message || 'Failed to increment view count');
        return;
      }
      
      // Update posts state with the new view count
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id ? {
          ...post,
          views: data.data.views || (post.views || 0) + 1
        } : post
      ));
      
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Instead of stopping completely, we can just update the local state
      // to provide a better user experience even when the API fails
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id ? {
          ...post,
          views: (post.views || 0) + 1
        } : post
      ));
    }
  };

  // Add function to check if a post has been viewed
  const hasBeenViewed = (postId) => {
    return viewedPostIds.includes(postId);
  };
  
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
    incrementViewCount,
    viewedPostIds,
    hasBeenViewed // Add this new function to the context value
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