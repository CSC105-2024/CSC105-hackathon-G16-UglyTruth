import React, { useState } from 'react';

const Filter = ({ onFilterChange, initialFilter = null }) => {
  const [selectedTag, setSelectedTag] = useState(initialFilter);
  
  const tags = [
    "Home", "Love", "Friends", "Family", "School", "Work",
    "Money", "Health", "Society", "Internet", "Loss", "Self", "Other"
  ];

  const handleTagClick = (tag) => {
    const newTag = selectedTag === tag ? null : tag === "All" ? null : tag;
    
    setSelectedTag(newTag);
    
    // Call parent callback if provided
    if (onFilterChange) {
      onFilterChange(newTag);
    }
  };

  const clearFilter = () => {
    setSelectedTag(null);
    if (onFilterChange) {
      onFilterChange(null);
    }
  };

  return (
    <div className="bg-sage rounded-xl border border-cream p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-linen">Filter by Category</h3>
        {selectedTag && (
          <button
            onClick={clearFilter}
            className="text-xs text-linen/60 hover:text-linen font-medium underline"
          >
            Clear Filter
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedTag === tag || (tag === "All" && !selectedTag)
                ? 'bg-midnight text-cream shadow-md scale-105'
                : 'bg-cream text-midnight hover:bg-opacity-80 hover:shadow-sm'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {selectedTag && (
        <div className="mt-3 pt-2 border-t border-cream/30">
          <p className="text-xs text-linen/70">
            Showing: <span className="font-medium">{selectedTag}</span> posts
          </p>
        </div>
      )}
    </div>
  );
};

export default Filter;