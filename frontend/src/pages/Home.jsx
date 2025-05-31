import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import PostCard from '../components/PostCard';
import PostCounter from '../components/PostCounter';
import { usePost } from '../contexts/PostContext';
import Filter from '../components/Filter'; 
import { Search } from 'lucide-react';
import SideBarMobile from '../components/SideBarMobile';

const Home = () => {
  const { posts, fetchPosts, isLoading, searchPosts } = usePost();
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("HOME");
  const [allPosts, setAllPosts] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Add this effect to detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      await fetchPosts();
    };
    loadPosts();
  }, [fetchPosts]);

<<<<<<< HEAD
  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts(posts);
    }
  }, [posts]);
=======

const mockPosts = [
  {
    id: 1,
    title: "Overwhelmed by School",
    content: "I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. ",
    tag: presetTags[3], // "School"
    warning: true,
    views: 42,
    likes: 15,
  },
  {
    id: 2,
    title: "Simple Joys with Friends",
    content: "Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count!",
    tag: presetTags[1], // "Friends"
    views: 58,
    likes: 22,
  },
  {
    id: 3,
    title: "Work Stress Again",
    content: "Work stress is piling up again. Just needed to let it out anonymously. Work stress is piling up again. Just needed to let it out anonymously. Work stress is piling up again. Just needed to let it out anonymously. Work stress is piling up again. Just needed to let it out anonymously.",
    tag: presetTags[4], // "Work"
    views: 30,
    likes: 9,
  },
];
>>>>>>> 6a8dc5802c940258f8d685d2bbec62c0654d0bd9

  const getFilteredPosts = () => {
    const postsToFilter = allPosts;
    
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-midnight text-cream font-nunito">
<<<<<<< HEAD
      {/* Sidebar - width changes based on screen size */}
      <div className={`${isDesktop ? 'w-[320px]' : 'w-[0px]'} shrink-0`}>
=======
      {/* Sidebar */}
      <div className="w-[320px]">
>>>>>>> 6a8dc5802c940258f8d685d2bbec62c0654d0bd9
        <SideBar />
      </div>

      {/* Main content area */}
      <div className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
        {/* Header and search */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center">
            {!isDesktop && (
              <button 
                onClick={toggleSidebar} 
                className="mr-3 mb-1 text-cream hover:text-linen"
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
          <div className="relative w-full sm:w-1/2">
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
        </div>

        {/* Content and filters */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* Posts Section */}
<<<<<<< HEAD
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {isLoading ? (
              <div className="text-center py-10">Loading posts...</div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
=======
        <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto pr-1 scrollbar-hidden">
            {mockPosts.map((post) => (
>>>>>>> 6a8dc5802c940258f8d685d2bbec62c0654d0bd9
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
          <div className="w-full lg:w-[260px] flex-shrink-0">
            <div className="sticky top-10 flex flex-col gap-4">
              <PostCounter currentPosts={2} maxPosts={5} />
              <Filter/>

<<<<<<< HEAD
            <Filter onFilterChange={handleFilterChange} initialFilter={selectedTag} />
=======
            </div>
>>>>>>> 6a8dc5802c940258f8d685d2bbec62c0654d0bd9
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
