import React from 'react';
import PostCard from './PostCard';

const Home = () => {
  const tags = ['Home', 'School', 'Society', 'Love', 'Work', 'Internet', 'Friends', 'Money', 'Self', 'Family', 'Health', 'Loss'];

  const posts = [
    {title: 'This is the title of the post', content: 'This is the content of the post...', tags: ['Love', '⚠️ Warning']},
    {title: 'This is the title of the post', content: 'This is the content of the post...', tags: ['Self']},
    {title: 'This is the title of the post', content: 'This is the content of the post...', tags: ['Internet', '⚠️ Warning']}
  ];

  return (
    <div className="flex flex-col p-8 ml-40 space-y-4 text-teal-800">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">HOME</h2>
        <input 
          type="text" 
          placeholder="Search post..." 
          className="rounded-full bg-teal-700 px-4 py-2 w-1/2 text-white placeholder-teal-300 focus:outline-none"
        />
      </div>

      {/* Main Area */}
      <div className="flex">
        {/* Left (Posts) */}
        <div className="flex flex-col w-2/3 pr-4 overflow-y-auto">
          {posts.map((post, index) => (
            <PostCard 
              key={index}
              title={post.title} 
              content={post.content} 
              tags={post.tags} 
            />
          ))}
        </div>

        {/* Right Sidebar (info) */}
        <div className="w-1/3 bg-teal-600 text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Post left Today</h3>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-teal-100">0</span>
            <input type="range" min="0" max="5" value="2" className="w-full mx-2"/>
            <span className="font-bold text-teal-100">5</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-teal-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;