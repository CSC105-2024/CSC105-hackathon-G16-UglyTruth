import { useEffect, useState } from 'react';
import { usePost } from '../contexts/PostContext';
import PostCard from './PostCard.jsx';
import { Search, MapPin } from 'lucide-react';

const PostList = ({ posts: overridePosts }) => {
  const { posts: contextPosts, searchPosts, isLoading, error } = usePost();
  const [searchQuery, setSearchQuery] = useState('');
  const posts = overridePosts || contextPosts;

  // No need for fetchPosts here as it's already called in the HomePage component

  const handleSearch = (e) => {
    e.preventDefault();
    searchPosts(searchQuery);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-md">
        <p>Error loading posts: {error}</p>
        <button 
          onClick={() => fetchPosts()}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex-grow relative">
          <input
            type="text"
            placeholder="Search for experiences..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="input-field pr-10 w-full"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No posts found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;