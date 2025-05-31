import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ThumbsUp, Eye, TriangleAlert } from 'lucide-react';



const PostCard = ({ title, tag, warning, content, likes, views }) => {
  const [expanded, setExpanded] = useState(false);

  const previewLimit = 100;
  const safeContent = content || '';

  const truncatedContent = safeContent.length > previewLimit
    ? safeContent.slice(0, previewLimit) + '...'
    : safeContent;

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  warning: PropTypes.bool,
  content: PropTypes.string.isRequired,
  likes: PropTypes.number,
  views: PropTypes.number,
};

PostCard.defaultProps = {
  warning: false,
  likes: 0,
  views: 0,
};

  return (
    <div
      className="lg:w-[550px] bg-sage rounded-xl p-4 border  border-cream cursor-pointer transition-all duration-300"
      onClick={() => setExpanded(!expanded)}
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
          <span className="flex items-center gap-1"><Eye size={16} /> {views}</span>
          <span className="flex items-center gap-1"><ThumbsUp size={16} /> {likes}</span>
        </div>

        {expanded && (
          <button className="bg-linen text-cream px-3 py-1 rounded-xl hover:bg-opacity-90">
            Like
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
