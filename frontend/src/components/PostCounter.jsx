import React from 'react';
import { useViewLimit } from '../contexts/ViewLimitContext';

const PostCounter = () => {
  const { viewedPosts, maxDailyViews } = useViewLimit();
  const remainingPosts = maxDailyViews - viewedPosts;
  const percentage = maxDailyViews > 0 ? (viewedPosts / maxDailyViews) * 100 : 0;
  
  // Format the time to midnight in Thai time
  const getTimeToReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Midnight
    
    const timeRemaining = tomorrow - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="bg-sage rounded-xl border border-cream p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="font-bold text-xl text-linen mb-1">
          Daily Post Views
        </h2>
        <p className="text-sm text-linen/70 font-medium">
          {remainingPosts} posts remaining today
        </p>
      </div>
      
      <div className="flex items-center justify-between mb-2 text-sm font-semibold text-linen/80">
        <span>Used: {viewedPosts}</span>
        <span>Limit: {maxDailyViews}</span>
      </div>
      
      <div className="relative">
        <div className="flex-1 h-4 bg-linen/20 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full transition-all duration-500 ease-out rounded-full relative"
            style={{ 
              width: `${percentage}%`,
              background: percentage >= 90 
                ? 'linear-gradient(90deg, #D4AF37 0%, #B8860B 100%)' 
                : percentage >= 70 
                ? 'linear-gradient(90deg, #DAA520 0%, #B8860B 100%)' 
                : 'linear-gradient(90deg, #E6DDC4 0%, #D4C4A8 100%)'
            }}
          >
            {percentage > 15 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            )}
          </div>
        </div>
        
        <div className="flex justify-between mt-1">
          {[...Array(5)].map((_, i) => {
            const threshold = (i + 1) * 20;
            return (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  percentage >= threshold ? 'bg-linen' : 'bg-linen/30'
                }`}
              />
            );
          })}
        </div>
      </div>
      
      {remainingPosts === 0 && (
        <div className="mt-2 text-xs font-medium text-linen/60 text-center">
          Daily limit reached! Resets in {getTimeToReset()}
        </div>
      )}
    </div>
  );
};

export default PostCounter;