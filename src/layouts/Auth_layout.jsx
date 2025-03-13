import React from 'react'
import { Outlet } from 'react-router-dom'
Outlet
const Auth_layout = () => {
  return (
    <div>



        <Outlet />
    </div>
  )
}

export default Auth_layout