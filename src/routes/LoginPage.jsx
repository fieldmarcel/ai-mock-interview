import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const LoginPage = () => {
  return (
<div className="min-h-screen flex items-center justify-center">
  <SignIn path="/login" />
</div>  )
}

export default LoginPage