import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';
import { Plus } from 'lucide-react';

const CATEGORIES = [
  'Love',
  'Family',
  'Friends',
  'School',
  'Work',
  'Money',
  'Health',
  'Society',
  'Internet',
  'Loss',
  'Self',
  'Other',
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { posts, isLoading, error, fetchPosts } = usePost();
  const [selectedCategory, setSelectedCategory] = useState('Love');
  const [filteredPosts, setFilteredPosts] = useState([]);
  useEffect(() => {
    // Fetch posts from backend on mount
    fetchPosts();
    // Set document title
    document.title = 'UglyTruth - Explore Experiences';
  }, [fetchPosts]); // Add fetchPosts as a dependency
  
  useEffect(() => {
    // Filter posts based on selected category or show all if no category selected
    if (selectedCategory && selectedCategory !== '') {
      setFilteredPosts(posts.filter(post => 
        post.category && post.category.toLowerCase() === selectedCategory.toLowerCase()
      ));
    } else {
      setFilteredPosts(posts);
    }
    
    console.log('Filtering by category:', selectedCategory);
    console.log('Filtered posts:', posts.filter(post => 
      post.category && post.category.toLowerCase() === selectedCategory.toLowerCase()
    ));
  }, [selectedCategory, posts]);
  
  // Debug log to check if posts are being fetched correctly
  useEffect(() => {
    console.log('Current posts in HomePage:', posts);
  }, [posts]);
  return (
    <div>
      <section>
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Explore Experiences</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full border ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
            <button
              className={`px-3 py-1 rounded-full border ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
          </div>
        </div>
        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <PostList posts={filteredPosts} />
          )}
        </div>
      </section>
      
      {/* Floating Action Button for creating posts */}
      {isAuthenticated && (
        <Link 
          to="/create-post"
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Create new post"
        >
          <Plus className="h-6 w-6 text-white" />
        </Link>
      )}
    </div>
  );
};

export default HomePage;