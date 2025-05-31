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
  const [title, setTitle] = useState("HOME");
  const [allPosts, setAllPosts] = useState([]);
  

  // Fetch posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      await fetchPosts();
    };
    loadPosts();
  }, [fetchPosts]);

  // Store all posts when they are loaded
  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts(posts);
    }
  }, [posts]);

  // Filter posts by search query and tag
  const getFilteredPosts = () => {
    // Start with the posts to filter (all posts or API search results)
    const postsToFilter = allPosts;
    
    // First filter by category if selected
    const categoryFiltered = !selectedTag 
      ? postsToFilter 
      : postsToFilter.filter(post => post.category === selectedTag);
    
    // Then filter by search query if present
    if (!searchQuery.trim()) {
      return categoryFiltered;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    return categoryFiltered.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) || 
      post.description.toLowerCase().includes(lowerQuery)
    );
  };

  // Get the posts to display
  const filteredPosts = getFilteredPosts();

  // Handle search input
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      // Just set the search query, filtering happens in getFilteredPosts
      const query = e.target.value.trim();
      setSearchQuery(query);
      
      // Update the title based on search and tag
      if (query) {
        setTitle(selectedTag ? `${selectedTag} - SEARCH` : "SEARCH RESULTS");
      } else {
        setTitle(selectedTag || "HOME");
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Immediate filtering as user types
    if (e.target.value.trim() === '') {
      setTitle(selectedTag || "HOME");
    } else {
      setTitle(selectedTag ? `${selectedTag} - SEARCH` : "SEARCH RESULTS");
    }
  };

  // Handle filter change from Filter component
  const handleFilterChange = (tag) => {
    setSelectedTag(tag);
    
    // Keep search term but update the title
    if (searchQuery.trim()) {
      setTitle(tag ? `${tag} - SEARCH` : "SEARCH RESULTS");
    } else {
      setTitle(tag || "HOME");
    }
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
          <h1 className="text-4xl font-pica">{title}</h1>
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search post ..."
              className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
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
                  views={post.views || 0}
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
