import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
// import PrivatePosts from './pages/PrivatePosts';
// import PublicPosts from './pages/PublicPosts';
import SignUp from './pages/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <AuthProvider>
      <PostProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/public-posts" element={<PublicPosts />} />
        <Route path="/private-posts" element={<PrivatePosts />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
    </PostProvider>
    </AuthProvider>
  );
}

export default App;