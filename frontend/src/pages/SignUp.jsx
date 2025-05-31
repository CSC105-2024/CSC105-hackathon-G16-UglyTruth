import React from 'react'
import UglyTruthLogo from '/UglyTruthLogo.svg'

function SignUp() {
  const [count, setCount] = React.useState(0)

  return (
    <>
      <img src={UglyTruthLogo} alt="Ugly Truth Logo" />
      <h1 className="text-red-600">Sign Up</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

export default SignUp;