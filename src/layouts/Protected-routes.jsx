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
//  With replace={true}:

// The current page (e.g., /dashboard) is replaced by /login in the history stack.
// The user cannot navigate back to /dashboard using the browser's "Back" button.
// Without replace (default behavior):
// The current page (e.g., /dashboard) remains in the history stack.
// The user can navigate back to /dashboard using the browser's "Back" button.
  
return (
   children
  )
}

export default Protected