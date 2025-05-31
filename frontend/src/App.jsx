import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PostProvider } from './contexts/PostContext'
import Login from './pages/Login'
import HomePage from './pages/Home'
import CreatePost from './pages/CreatePost'
import SignUp from './pages/SignUp'

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </PostProvider>
    </AuthProvider>
  )
}

export default App;