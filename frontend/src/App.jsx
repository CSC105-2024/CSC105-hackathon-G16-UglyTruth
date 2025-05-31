import { useState } from 'react'
import UglyTruthLogo from '/UglyTruthLogo.svg'
import SignUp from './pages/SignUp'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SignUp />
    </>
  )
}

export default App
