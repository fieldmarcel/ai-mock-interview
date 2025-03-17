import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '/components/ui/sheet.jsx';
import { Menu, User, LogIn, LogOut } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react'; 
// import { useUser } from '@clerk/clerk-react';

const ToggleContainer = () => {
  const { userId } = useAuth();
//   const {user,isSignedIn}= useUser()

  return (
    <div>
      <Sheet>
        <SheetTrigger className="sm:hidden block p-2">
          <Menu className="h-6 w-6 text-gray-700 hover:text-gray-900 transition duration-300" />
        </SheetTrigger>

        <SheetContent side="right" className="w-72 bg-white">
          <SheetHeader>
            <div className="flex items-center space-x-3 border-b pb-4">
              {userId ? (
                <>
                  <div className="flex items-center space-x-2">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-gray-800 font-medium">My Profile</span>
                  </div>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 text-gray-700" />
                  <SheetTitle className="text-gray-800 font-medium">
                    <Link
                      to="/login"
                      className="hover:text-blue-600 transition duration-300"
                    >
                      Login to Continue
                    </Link>
                  </SheetTitle>
                </>
              )}
            </div>

            <nav className="mt-4 space-y-3">
              <Link
                to="/"
                className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50"
              >
                <span>Home</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50"
              >
                <span>Contact Us</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-3 text-gray-700 hover:text-yellow-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50"
              >
                <span>About Us</span>
              </Link>
              <Link
                to="/services"
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50"
              >
                <span>Services</span>
              </Link>
              {userId && (
                <Link
                  to="/generate"
                  className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50"
                >
                  <span>Take an Interview</span>
                </Link>
              )}
            </nav>

            {userId && (
              <div className="mt-6 border-t pt-4">
                <button
                  onClick={() => {
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-50 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ToggleContainer;