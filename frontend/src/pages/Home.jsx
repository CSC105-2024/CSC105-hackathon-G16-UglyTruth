import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import PostCard from '../components/PostCard';
import PostCounter from '../components/PostCounter';
import { usePost } from '../contexts/PostContext';
import Filter from '../components/Filter'; 

const Home = () => {
  const { posts, fetchPosts, isLoading, searchPosts } = usePost();
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts by selected tag
  const filteredPosts = !selectedTag 
    ? posts 
    : posts.filter(post => post.category === selectedTag);

  // Handle search submit
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        searchPosts(searchQuery);
      } else {
        fetchPosts();
      }
    }
  };

  // Handle filter change from Filter component
  const handleFilterChange = (tag) => {
    setSelectedTag(tag);
    setSearchQuery("");
  };

  return (
    <div className="flex h-screen w-screen bg-midnight text-cream font-nunito">
      {/* Sidebar */}
      <div className="w-[320px] shrink-0">
        <SideBar />
      </div>

      {/* Main content area */}
      <div className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
        {/* Header and search */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-4xl font-pica">HOME</h1>
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search post ..."
              className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <div className="absolute right-3 top-2">🔽</div>
          </div>
        </div>

        {/* Content and filters */}
        <div className="flex flex-col lg:flex-row gap-6 overflow-auto">
          {/* Posts Section */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {isLoading ? (
              <div className="text-center py-10">Loading posts...</div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  tag={post.category}
                  warning={false}
                  content={post.description}
                  relatableCount={post.relatableCount || 0}
                  views={0}
                  userRelated={post.userRelated || false}
                />
              ))
            ) : (
              <div className="text-center py-10">No posts found</div>
            )}
          </div>

          {/* Sidebar Tags and Meter */}
          <div className="w-full lg:w-[260px] flex flex-col gap-4">
            <PostCounter currentPosts={2} maxPosts={5} />

            <Filter onFilterChange={handleFilterChange} initialFilter={selectedTag} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
