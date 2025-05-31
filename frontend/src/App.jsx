import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PostProvider } from './contexts/PostContext'
import { useAuth } from './contexts/AuthContext'
import { Home, Plus, User } from 'lucide-react'

// Pages
import HomePage from './pages/Home'
import CreatePost from './pages/CreatePost'
import SignUp from './pages/SignUp'
import LoginPage from './pages/Login'

// Navigation component
const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                UglyTruth
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                <Home className="h-5 w-5" />
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/create-post" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/create-post' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  <Plus className="h-5 w-5" />
                </Link>
              )}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Log In
                </Link>
              ) : (
                <button 
                  onClick={logout}
                  className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Log Out
                </button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <div className="flex space-x-4">
                <Link to="/" aria-label="Home">
                  <Home className="h-5 w-5 text-gray-700" />
                </Link>
                {isAuthenticated && (
                  <Link to="/create-post" aria-label="Create Post">
                    <Plus className="h-5 w-5 text-gray-700" />
                  </Link>
                )}
                {isAuthenticated ? (
                  <button onClick={logout}>
                    <User className="h-5 w-5 text-gray-700" />
                  </button>
                ) : (
                  <Link to="/login" className="text-sm font-medium text-gray-700">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </PostProvider>
    </AuthProvider>
  )
}

export default App
