import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useAuth,useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
const ProfileContainer = () => {

  // const {isSignedIn} = useAuth();
const {user,isSignedIn}= useUser()
  return (
    <div className="flex items-center space-x-4">
      <div className="relative hidden sm:block ">
{    isSignedIn ?    <UserButton afterSignOutUrl="/" className="" /> : <Link to="/login"><button> Login</button></Link>
}      </div>

{  isSignedIn &&(<span className="hidden sm:inline-block md:inline-block text-gray-700 font-medium">{ user?.firstName}</span>)    
}    </div>
  );
};

export default ProfileContainer;