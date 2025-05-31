import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
//import Login from './pages/LogIn'
//import Home from './pages/Home'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
