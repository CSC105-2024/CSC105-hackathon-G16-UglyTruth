import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/LogIn';
import PrivatePosts from './pages/PrivatePosts';
import PublicPosts from './pages/PublicPosts';
import SignUp from './pages/SignUp';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/public-posts" element={<PublicPosts />} />
        <Route path="/private-posts" element={<PrivatePosts />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
}

export default App;