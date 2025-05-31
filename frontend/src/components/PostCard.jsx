import { Link } from 'react-router-dom';
import { Calendar, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';

const PostCard = ({ post }) => {
  const { isAuthenticated, user } = useAuth();
  const { toggleRelatable } = usePost();
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user has marked relatable
  const isRelatable = isAuthenticated && post.relatables && user
    ? post.relatables.some(r => r.userId === user.id)
    : false;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRelatable = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await toggleRelatable(post.id);
    } catch (e) {
      // Optionally show error
    }
    setIsLoading(false);
  };

  return (
    <div className="card overflow-hidden transition-all duration-300 hover:translate-y-[-5px] group animate-enter">
      {/* Image (optional) */}
      {post.imageUrl && (
        <Link to={`/posts/${post.id}`} className="block h-52 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="capitalize font-semibold text-blue-600 mr-2">{post.category}</span>
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <Link to={`/posts/${post.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 mb-2 line-clamp-1">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.description}
        </p>
        <div className="flex justify-between items-center text-sm mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">By User #{post.authorId}</span>
          </div>
          <button
            onClick={handleRelatable}
            disabled={!isAuthenticated || isLoading}
            className={`flex items-center px-2 py-1 rounded-full border transition-all duration-200 ${
              isRelatable ? 'bg-pink-100 text-pink-600 border-pink-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isAuthenticated ? (isRelatable ? 'Unmark as relatable' : 'Mark as relatable') : 'Login to mark relatable'}
          >
            <Heart className={`h-4 w-4 mr-1 ${isRelatable ? 'fill-pink-600' : ''}`} />
            <span>{post.relatableCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;