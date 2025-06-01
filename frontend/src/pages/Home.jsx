import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import SideBarMobile from '../components/SideBarMobile';
import PostCard from '../components/PostCard';
import PostCounter from '../components/PostCounter';
import { usePost } from '../contexts/PostContext';
import Filter from '../components/Filter'; 
import { Menu, Search, Funnel } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import { useViewLimit } from '../contexts/ViewLimitContext';

const Home = () => {
  const { posts, fetchPosts, isLoading, searchPosts } = usePost();
  // Get the values from context
  const { viewedPosts, maxDailyViews } = useViewLimit();
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("HOME");
  const [allPosts, setAllPosts] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const isMobile = useIsMobile();

  // Add this effect to detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // Close mobile sidebar when switching to desktop
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add click outside handler for mobile sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only run this on mobile when sidebar is open
      if (!isDesktop && sidebarOpen) {
        // Check if the click is outside the sidebar
        const sidebar = document.getElementById("mobile-sidebar");
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    // Add event listener when sidebar is open
    if (sidebarOpen && !isDesktop) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, isDesktop]);

  useEffect(() => {
    const loadPosts = async () => {
      await fetchPosts();
    };
    loadPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts(posts);
    }
  }, [posts]);

  const getFilteredPosts = () => {
    let postsToFilter = allPosts;
    
    // Category filter
    const categoryFiltered = !selectedTag 
      ? postsToFilter 
      : postsToFilter.filter(post => post.category === selectedTag);
    
    // Search filter
    let filteredResults = !searchQuery.trim()
      ? categoryFiltered
      : categoryFiltered.filter(post => {
          const lowerQuery = searchQuery.toLowerCase();
          return post.title.toLowerCase().includes(lowerQuery) || 
                post.description.toLowerCase().includes(lowerQuery);
        });
    
    // Apply sorting if selected
    if (sortBy) {
      filteredResults = [...filteredResults].sort((a, b) => {
        if (sortBy === 'time') {
          // Sort by creation date (newest first)
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        } else if (sortBy === 'views') {
          // Sort by view count (highest first)
          return (b.views || 0) - (a.views || 0);
        } else if (sortBy === 'related') {
          // Sort by relatable count (highest first)
          return (b.relatableCount || 0) - (a.relatableCount || 0);
        }
        return 0;
      });
    }
    
    return filteredResults;
  };

  // Get the posts to display with filters and sorting applied
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

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle sort change from Filter component
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  if (isMobile) {
    return (
      <div className="relative flex flex-col h-screen w-screen bg-midnight text-cream font-nunito overflow-hidden">
        {/* Sidebar Mobile Drawer */}
        <SideBarMobile isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cream">
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSidebar}>
            <Menu size={24} />
            <h1 className="text-2xl font-pica">{title}</h1>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center px-4 py-2 gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search post ..."
              className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
            />
            <div className="absolute right-5 top-2.5">
              <Search size={18} />
            </div>
          </div>

          {/* Toggle filter dropdown */}
          <div className="relative">
            <button
              className="p-2 border border-cream rounded-xl hover:bg-cream hover:text-midnight transition"
              onClick={toggleFilter}
            >
              <Funnel size={18} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 z-20 bg-sage border border-cream rounded-lg shadow-lg p-4 w-64">
                <Filter 
                  onFilterChange={handleFilterChange} 
                  initialFilter={selectedTag} 
                  onSortChange={handleSortChange} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Loading posts...</div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                tag={post.category}
                warning={post.warning || false}
                content={post.description}
                relatableCount={post.relatableCount || 0}
                views={post.views || 0}
                userRelated={post.userRelated || false}
                isAudio={post.isAudio || false}
                audioPath={post.audioPath || null}
              />
            ))
          ) : (
            <div className="text-center py-10">No posts found</div>
          )}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex h-screen w-screen bg-midnight text-cream font-nunito">
      <div className="w-[320px]">
        <SideBar />
      </div>

      <div className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-4xl font-pica">{title}</h1>
          <div className="flex items-center gap-3 w-full sm:w-1/2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search post ..."
                className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearch}
              />
              <div className="absolute right-5 top-3">
                <Search size={18} />
              </div>
            </div>
            <button onClick={toggleFilter} className="p-2 border border-cream rounded-xl hover:bg-cream hover:text-midnight transition-colors">
              <Funnel size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto pr-1 scrollbar-hidden">
            {isLoading ? (
              <div className="text-center py-10">Loading posts...</div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  tag={post.category}
                  warning={post.warning || false}
                  content={post.description}
                  relatableCount={post.relatableCount || 0}
                  views={post.views || 0}
                  userRelated={post.userRelated || false}
                  isAudio={post.isAudio || false}
                  audioPath={post.audioPath || null}
                />
              ))
            ) : (
              <div className="text-center py-10">No posts found</div>
            )}
          </div>

          {/* Sidebar Tags and Meter */}
          <div className="w-full lg:w-[260px] flex-shrink-0">
            <div className="sticky top-10 flex flex-col gap-4">
              <PostCounter />
              <Filter 
                onFilterChange={handleFilterChange} 
                initialFilter={selectedTag} 
                onSortChange={handleSortChange} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
