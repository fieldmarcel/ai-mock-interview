import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const LoginPage = () => {
  return (
    <div><SignIn  path='/login'/></div>
  )
}

export default LoginPage