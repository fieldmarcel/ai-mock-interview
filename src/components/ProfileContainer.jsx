import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import {
  User,
  Settings,
  LogOut,
  CreditCard,
  LifeBuoy,
  ChevronDown
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '/components/ui/dropdown-menu';

const ProfileContainer = () => {
  
  const { user, isSignedIn } = useUser();

  if (isSignedIn && user) {
    return (
      <div className="   sm:flex  px-4 py-3 items-center ">
        <div className="relative">
          <UserButton afterSignOutUrl="/" />
        </div>
        
        {isSignedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden sm:flex items-center space-x-1 text-gray-700 font-medium hover:text-gray-900 transition-colors">
                <span>{user?.firstName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56 bg-white border-gray-200 border rounded-lg shadow-md" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                  <p className="text-xs leading-none text-gray-500">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-full px-4 py-3 items-center space-x-4 shadow-sm border border-gray-100">
      <Link to="/login">
        <button className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors flex items-center space-x-2">
          <span>Login</span>
        </button>
      </Link>
    </div>
  );
};

export default ProfileContainer;