import React from 'react';
import SideBar from '../components/SideBar';

const CreatePost = () => {
  return (
    <div>
      <SideBar />
      <div className="flex-1 p-8 text-color-linen">
        {/* Main content area */}
        <h1 className="text-2xl font-pica mb-6">Create New Post</h1>
        {/* Add your post creation form/components here */}
      </div>
    </div>
  );
};

export default CreatePost;