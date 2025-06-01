import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import PostCard from '../components/PostCard';
import { usePost } from '../contexts/PostContext';
import Filter from '../components/Filter'; 
import { Search, Funnel } from 'lucide-react';
import SideBarMobile from '../components/SideBarMobile';
import { useAuth } from '../contexts/AuthContext';
import { Axios } from '../axiosinstance';

const PrivatePosts = () => {
  const { isLoading } = usePost();
  const { user } = useAuth();
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  cost [title, setTitle] = useState("PRIVATE POSTS");
  const [privatePosts, setPrivatePosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null``);
  
  // Handle screen size changes
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

  // Fetch private posts for the current user
  useEffect(() => {
    const fetchPrivatePosts = async () => {
      if (!user || !user.id) return;
      
      setFetchLoading(true);
      try {
        const response = await Axios.get(`/users/${user.id}/posts?private=true`);
        if (response.data.success) {
          setPrivatePosts(response.data.posts || []);
        } else {
          console.error("Failed to fetch private posts:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching private posts:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPrivatePosts();
  }, [user]);

  // Update allPosts when privatePosts changes
  useEffect(() => {
    setAllPosts(privatePosts);
  }, [privatePosts]);

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

  // Get the posts to display
  const filteredPosts = getFilteredPosts();

  // Handle search input on Enter
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      setSearchQuery(query);
      
      // Update the title based on search and tag
      if (query) {
        setTitle(selectedTag ? `${selectedTag} - SEARCH` : "PRIVATE POSTS - SEARCH");
      } else {
        setTitle(selectedTag ? selectedTag : "PRIVATE POSTS");
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Immediate filtering as user types
    if (e.target.value.trim() === '') {
      setTitle(selectedTag || "PRIVATE POSTS");
    } else {
      setTitle(selectedTag ? `${selectedTag} - SEARCH` : "PRIVATE POSTS - SEARCH");
    }
  };

  // Handle filter change from Filter component
  const handleFilterChange = (tag) => {
    setSelectedTag(tag);
    
    // Keep search term but update the title
    if (searchQuery.trim()) {
      setTitle(tag ? `${tag} - SEARCH` : "PRIVATE POSTS - SEARCH");
    } else {
      setTitle(tag || "PRIVATE POSTS");
    }
  };

  // Handle sort change from Filter component
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-midnight text-cream font-nunito">
      {/* Sidebar - width changes based on screen size */}
      <div className={`${isDesktop ? 'w-[320px]' : 'w-[0px]'} shrink-0`}>
        {isDesktop ? (
          <SideBar />
        ) : (
          // Only render if open
          sidebarOpen && (
            <div id="mobile-sidebar">
              <SideBarMobile onClose={() => setSidebarOpen(false)} />
            </div>
          )
        )}
      </div>

      {/* Overlay for when mobile sidebar is open */}
      {!isDesktop && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/15 bg-opacity-50 z-30" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
        {/* Header and search */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 -mb-6">
          <div className="flex items-center">
            {!isDesktop && (
              <button 
                onClick={toggleSidebar} 
                className="mr-3 mb-1 text-cream hover:text-linen z-40"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            {!isDesktop && (
              <p className="text-4xl font-pica">{title}</p>
            )}
            {isDesktop && (
              <p className="text-5xl font-pica">{title}</p>
            )}
          </div>
          <div className="flex items-center gap-3 w-94 sm:w-1/2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search private posts..."
                className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearch}
              />
              <div className="absolute right-5 top-3">
                <Search size={18} />
              </div>
            </div>
            <button onClick={toggleFilter} className="">
              {isFilterOpen ? (
                <div className='flex items-center text-sage justify-center w-[41.6px] h-[45.6px] rounded-lg bg-cream hover:bg-cream hover:text-midnight transition-colors'>
                  {!isDesktop && <Funnel className="" size={22} />}
                </div>
              ) : (
                <div className='flex items-center justify-center w-[41.6px] h-[41.6px] rounded-lg border border-cream hover:bg-cream hover:text-midnight transition-colors'>
                  {!isDesktop && <Funnel className="" size={22} />}
                </div>
              )}
            </button>
          </div>
          {isDesktop && <Funnel />}
        </div>

        {/* Content and filters */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* Sidebar Tags and Meter */}
          {!isDesktop && isFilterOpen && (
            <div className="w-full lg:w-[260px] flex-shrink-0">
              <div className="sticky top-10 flex flex-col gap-4">
                <Filter 
                  onFilterChange={handleFilterChange} 
                  initialFilter={selectedTag}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          )}

          {/* Posts Section */}
          <div className="flex-1 mt-0 flex flex-col gap-4 min-w-0 overflow-y-auto pr-1 scrollbar-hidden">
            {isLoading || fetchLoading ? (
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
              <div className="text-center py-10">No private posts found</div>
            )}
          </div>

          {/* Sidebar Tags for desktop - add this */}
          {isDesktop && (
            <div className="w-full lg:w-[260px] flex-shrink-0">
              <div className="sticky top-10 flex flex-col gap-4">
                <Filter 
                  onFilterChange={handleFilterChange} 
                  initialFilter={selectedTag}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivatePosts;