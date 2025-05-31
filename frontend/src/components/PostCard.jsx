import React from 'react';

const PostCard = ({ title, content, tags }) => {
  return (
    <div className="bg-teal-700 text-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{content}</p>
      <div className="flex space-x-2 mt-2">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-teal-900 text-teal-200 px-2 py-0.5 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PostCard;