import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const SignupPage = () => {
  return (
    <SignUp path='/signup' />
  )
}

export default SignupPage