import React from 'react'
import { useAuth } from '@clerk/clerk-react'
import LoaderPage from '../routes/LoaderPage'
import { Navigate } from 'react-router-dom'
const Protected = ({children}) => {

const {isLoaded, isSignedIn}= useAuth()
if (!isLoaded){
    return <LoaderPage/>
}
 if(!isSignedIn){
    return <Navigate to={"/login"} replace />
 }

return (
   children
  )
}

export default Protected