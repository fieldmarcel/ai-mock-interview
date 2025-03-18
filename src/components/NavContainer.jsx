import React from 'react';
import { useAuth } from '@clerk/clerk-react'
 import { Link } from 'react-router-dom'
const NavContainer = () => {

    const { userId } = useAuth()
  return (
    <nav className="  flex space-x-8 justify-center">
      <Link
        to="/"
        className="text-gray-700 hover:text-pink-600 transition duration-300 font-medium"
      >
        Home
      </Link>
      <Link
        to="/contact"
        className="text-gray-700 hover:text-orange-600 transition duration-300 font-medium"
      >
        Contact Us
      </Link>
      <Link
        to="/about"
        className="text-gray-700 hover:text-yellow-600 transition duration-300 font-medium"
      >
        About Us
      </Link>
      <Link
        to="/services"
        className="text-gray-700 hover:text-red-600 transition duration-300 font-medium"
      >
        Services
      </Link>
{
userId ? <Link
        to="/generate"
        className="text-gray-700 hover:text-red-600 transition duration-300 font-medium"
      >
        Take an Interview
      </Link> : <Link
        to="/login"
        className="text-gray-700 hover:text-red-600 transition duration-300 font-medium">Login to take an Interview </Link>
}
   </nav>
  );
};

export default NavContainer;