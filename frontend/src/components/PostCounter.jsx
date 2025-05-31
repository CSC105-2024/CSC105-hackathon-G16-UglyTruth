import React from 'react';

const PostCounter = ({ currentPosts = 0, maxPosts = 5, title = "Post left Today" }) => {
  const percentage = maxPosts > 0 ? (currentPosts / maxPosts) * 100 : 0;
  
  return (
    <div className="bg-sage rounded-xl border border-cream p-4">
      <h2 className="font-bold mb-2 text-xl">{title}</h2>
      <div className="flex items-center gap-2 text-lg">
        <span>{currentPosts}</span>
        <div className="flex-1 h-3 bg-midnight rounded-full overflow-hidden">
          <div 
            className="bg-cream h-full transition-all duration-300 ease-in-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span>{maxPosts}</span>
      </div>
    </div>
  );
};

export default PostCounter;