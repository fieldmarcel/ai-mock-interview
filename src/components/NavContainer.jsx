import React from 'react';
import { useAuth } from '@clerk/clerk-react'
 import { Link } from 'react-router-dom'
const NavContainer = () => {

    const { userId } = useAuth()
  return (
    <nav className="sticky z-50 bg-white border-gray-200 border-2 rounded-full p-4 mx-20 flex space-x-8 justify-center">
      <Link
        to="/"
        className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
      >
        Home
      </Link>
     
      {/* <Link
        to="/about"
        className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
      >
        About Us
      </Link> */}
      {/* <Link
        to="/services"
        className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
      >
        Services
      </Link> */}
{
userId ? <Link
        to="/generate"
        className="text-gray-800  items-center font-extralight text-xm bg-gray-300 p-1  px-4 rounded-full hover:text-gray-200 hover:bg-gray-800 transition  hover:-translate-y-0.5 duration-300 "
      >
        Take an Interview
      </Link> : <Link
        to="/login"
        className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">Login to take an Interview </Link>
}
   </nav>
  );
};

export default NavContainer;