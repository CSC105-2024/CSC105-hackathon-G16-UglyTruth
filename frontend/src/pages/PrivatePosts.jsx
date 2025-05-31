import React from 'react';
import SideBar from '../components/SideBar';

const PrivatePosts = () => {
  return (
    <div>
      <SideBar />
      <div className="flex-1 p-8 text-color-linen">
        {/* Main content area */}
        <h1 className="text-2xl font-pica mb-6">Private Posts</h1>
        {/* Add your private posts content here */}
      </div>
    </div>
  );
};

export default PrivatePosts;