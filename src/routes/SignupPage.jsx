import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
  <SignUp path="/signup" />
</div>
  )
}

export default SignupPage