import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
// import PrivatePosts from './pages/PrivatePosts';
// import PublicPosts from './pages/PublicPosts';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/*<Route path="/posts">
          <Route path="public" element={<PublicPosts />} />
          <Route path="private" element={<PrivatePosts />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;