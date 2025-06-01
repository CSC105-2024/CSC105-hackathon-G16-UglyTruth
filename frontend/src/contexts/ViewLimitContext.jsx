import React, { createContext, useContext, useState, useEffect } from 'react';

const ViewLimitContext = createContext();

export function useViewLimit() {
  return useContext(ViewLimitContext);
}

export function ViewLimitProvider({ children }) {
  const [viewedPosts, setViewedPosts] = useState(0);
  const [viewedPostIds, setViewedPostIds] = useState([]);
  const MAX_DAILY_VIEWS = 5;

  // Function to check if we should reset based on Thai time
  const shouldResetBasedOnThaiTime = () => {
    // Thailand is UTC+7
    const thaiTimeOptions = { timeZone: 'Asia/Bangkok' };
    const thaiDateStr = new Date().toLocaleDateString('en-US', thaiTimeOptions);
    const storedThaiDate = localStorage.getItem('viewLimitThaiDate');
    
    if (storedThaiDate !== thaiDateStr) {
      // It's a new day in Thai time
      localStorage.setItem('viewLimitThaiDate', thaiDateStr);
      return true;
    }
    return false;
  };

  // Load view count from localStorage on component mount
  useEffect(() => {
    const loadViewData = () => {
      // Check if we need to reset based on Thai time
      if (shouldResetBasedOnThaiTime()) {
        localStorage.setItem('viewedPosts', '0');
        localStorage.setItem('viewedPostIds', JSON.stringify([]));
        setViewedPosts(0);
        setViewedPostIds([]);
        return;
      }
      
      // Load existing values
      const count = parseInt(localStorage.getItem('viewedPosts') || '0', 10);
      const ids = JSON.parse(localStorage.getItem('viewedPostIds') || '[]');
      setViewedPosts(count);
      setViewedPostIds(ids);
    };
    
    loadViewData();
    
    // Check for day rollover every minute
    const intervalId = setInterval(() => {
      if (shouldResetBasedOnThaiTime()) {
        loadViewData(); // This will reset if it's a new day in Thai time
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Update view count and store in localStorage
  const incrementViewCount = (postId) => {
    // If already viewed this post today, don't count it again
    if (viewedPostIds.includes(postId)) {
      return true; // Return true to indicate viewing is allowed
    }
    
    // If reached limit, don't allow more views
    if (viewedPosts >= MAX_DAILY_VIEWS) {
      return false; // Return false to indicate viewing is not allowed
    }
    
    const newCount = viewedPosts + 1;
    const newIds = [...viewedPostIds, postId];
    
    setViewedPosts(newCount);
    setViewedPostIds(newIds);
    
    localStorage.setItem('viewedPosts', String(newCount));
    localStorage.setItem('viewedPostIds', JSON.stringify(newIds));
    
    return true;
  };

  const value = {
    viewedPosts,
    viewedPostIds,
    maxDailyViews: MAX_DAILY_VIEWS,
    incrementViewCount,
    hasReachedLimit: viewedPosts >= MAX_DAILY_VIEWS
  };

  return (
    <ViewLimitContext.Provider value={value}>
      {children}
    </ViewLimitContext.Provider>
  );
}