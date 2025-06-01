import React, { useState } from 'react';

const Filter = ({ onFilterChange, initialFilter = null, onSortChange }) => {
  const [selectedTag, setSelectedTag] = useState(initialFilter);
  const [selectedSort, setSelectedSort] = useState(null);

  const tags = [
    "Home", "Love", "Friends", "Family", "School", "Work",
    "Money", "Health", "Society", "Internet", "Loss", "Self", "Other"
  ];

  const sortOptions = [
    { label: "Time", value: "time" },
    { label: "Views", value: "views" },
    { label: "Related", value: "related" },
  ];

  const handleTagClick = (tag) => {
    if (tag === "Home") {
      setSelectedTag(null);
      if (onFilterChange) {
        onFilterChange(null);
      }
      return;
    }
    
    const newTag = selectedTag === tag ? null : tag === "All" ? null : tag;
    setSelectedTag(newTag);
    if (onFilterChange) onFilterChange(newTag);
  };

  const clearFilter = () => {
    setSelectedTag(null);
    if (onFilterChange) onFilterChange(null);
  };

  const handleSortClick = (sortValue) => {
    const newSort = selectedSort === sortValue ? null : sortValue;
    setSelectedSort(newSort);
    if (onSortChange) onSortChange(newSort);
  };

  return (
    <div className="bg-sage rounded-xl border border-cream p-4">
      {/* Header */}
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

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
              (tag === "Home" && !selectedTag) || selectedTag === tag
                ? 'bg-midnight text-cream shadow-md scale-105'
                : 'bg-cream text-midnight hover:bg-opacity-80 hover:shadow-sm'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Sort Separator */}
      <div className="border-t border-cream/30 my-2"></div>

      {/* Sort Buttons */}
      <div className="flex flex-wrap gap-2">
        <h3 className="w-full font-bold text-sm text-linen mb-1">Sort by</h3>
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleSortClick(option.value)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedSort === option.value
                ? 'bg-midnight text-cream shadow-md scale-105'
                : 'bg-cream text-midnight hover:bg-opacity-80 hover:shadow-sm'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
