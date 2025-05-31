import React from 'react';
import SideBar from '../components/SideBar';

const PublicPosts = () => {
  return (
    <div>
      <SideBar />
      <div className="flex-1 p-8 text-color-linen">
        {/* Main content area */}
        <h1 className="text-2xl font-pica mb-6">Public Posts</h1>
        {/* Add your public posts content here */}
      </div>
    </div>
  );
};

export default PublicPosts;
