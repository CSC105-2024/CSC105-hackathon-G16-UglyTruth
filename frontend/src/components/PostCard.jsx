import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HeartCrack, Eye, TriangleAlert } from 'lucide-react';
import { usePost } from '../contexts/PostContext';

// Update the props to include id and relatableCount
const PostCard = ({ id, title, tag, warning, content, relatableCount, views: initialViews, userRelated }) => {
  const [expanded, setExpanded] = useState(false);
  const [viewCount, setViewCount] = useState(initialViews || 0);
  const { toggleRelatable, incrementViewCount } = usePost();
  const previewLimit = 100;
  const safeContent = content || '';
  
  // Update local view count when prop changes
  useEffect(() => {
    setViewCount(initialViews || 0);
  }, [initialViews]);
  
  // Prevent event propagation to avoid expanding the card when clicking the button
  const handleToggle = (e) => {
    e.stopPropagation();
    toggleRelatable(id);
  };

  const handleExpand = () => {
    // Only increment view when expanding, not when collapsing
    if (!expanded) {
      incrementViewCount(id);
      setViewCount(prev => prev + 1);
    }
    setExpanded(!expanded);
  };
  
  const truncatedContent = safeContent.length > previewLimit
    ? safeContent.slice(0, previewLimit) + '...'
    : safeContent;

  return (
    <div
      className="bg-sage rounded-xl p-4 border border-cream cursor-pointer transition-all duration-300"
      onClick={handleExpand}
    >
      <h3 className="text-lg font-bold text-linen mb-2">{title}</h3>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-cream text-midnight px-2 py-0.5 rounded-full text-xs font-black">{tag}</span>
        {warning && (
          <span className="border border-2 border-amber-300 text-amber-300 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
            <TriangleAlert size={14}/>
            Warning
          </span>
        )}
      </div>

      <p className="text-linen text-sm mb-4">
        {expanded ? safeContent : truncatedContent}
      </p>

      <div className="flex items-center justify-between text-sm text-linen font-semibold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Eye size={16} /> {viewCount}</span>
          <span className="flex items-center gap-1"><HeartCrack size={16}/> {relatableCount}</span>
        </div>

        {expanded && (
          <button 
            onClick={handleToggle} 
            className={`bg-linen text-midnight font-pica px-3 py-1 rounded-xl cursor-pointer transition-colors ${
              userRelated ? 'bg-cream text-midnight' : 'bg-linen text-midnight'
            }`}
          >
            {userRelated ? 'Related' : 'Relatable'}
          </button>
        )}
      </div>
    </div>
  );
};

PostCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  warning: PropTypes.bool,
  content: PropTypes.string.isRequired,
  relatableCount: PropTypes.number,
  views: PropTypes.number,
  userRelated: PropTypes.bool
};

PostCard.defaultProps = {
  warning: false,
  relatableCount: 0,
  views: 0,
  userRelated: false
};

export default PostCard;
