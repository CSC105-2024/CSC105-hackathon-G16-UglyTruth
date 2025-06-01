import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import SideBarMobile from '../components/SideBarMobile';
import PostCard from '../components/PostCard';
import PostCounter from '../components/PostCounter';
import Filter from '../components/Filter'; 
import { Menu, Search, Funnel } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const Home = () => {
  const isMobile = useIsMobile();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleFilter = () => setIsFilterOpen((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const presetTags = [
    "Love", "Friends", "Family", "School", "Work",
    "Money", "Health", "Society", "Internet", "Loss", "Self", "Other"
  ];

  const mockPosts = [
    {
      id: 1,
      title: "Post 1",
      tag: "Love",
      warning: "true",
      content: "This is the content of post 1.",
      likes: 10,
      views: 100,
    },
    {
      id: 2,
      title: "Post 2",
      tag: "Friends",
      warning: "true",
      content: "This is the content of post 2.",
      likes: 20,
      views: 200,
    },
    // Add more mock posts as needed
  ];

if (isMobile) {
    return (
      <div className="relative flex flex-col h-screen w-screen bg-midnight text-cream font-nunito overflow-hidden">
      {/* Sidebar Mobile Drawer */}
      <SideBarMobile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cream">
        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSidebar}>
          <Menu size={24} />
          <h1 className="text-2xl font-pica">HOME</h1>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center px-4 py-2 gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search post ..."
            className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
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
              <Filter />
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            tag={post.tag}
            warning={post.warning}
            content={post.content}
            likes={post.likes}
            views={post.views}
          />
        ))}
      </div>
    </div>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="flex h-screen w-screen bg-midnight text-cream font-nunito">
      <div className="w-[320px]">
        <SideBar />
      </div>

      <div className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-4xl font-pica">HOME</h1>
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search post ..."
              className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
            />
            <div className="absolute right-5 top-3">
              <Search size={18} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto pr-1 scrollbar-hidden">
            {mockPosts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                tag={post.tag}
                warning={post.warning}
                content={post.content}
                likes={post.likes}
                views={post.views}
              />
            ))}
          </div>

          <div className="w-full lg:w-[260px] flex-shrink-0">
            <div className="sticky top-10 flex flex-col gap-4">
              <PostCounter currentPosts={2} maxPosts={5} />
              <Filter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
