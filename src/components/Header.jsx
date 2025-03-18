import React from 'react'
// import { UserButton } from '@clerk/clerk-react'
import Container from './Container'
 import { Link } from 'react-router-dom'
import LogoContainer from './LogoContainer'
import NavContainer from './NavContainer'
import ProfileContainer from './ProfileContainer'
import ToggleContainer from './ToggleContainer'
const Header = () => {
  
  return (
    <header className="   py-2   top-0 z-10">
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <div className="flex-shrink-0">
            <LogoContainer />
          </div>
          
          {/* Navigation section - centered */}
          <div className="hidden sm:block flex-grow mx-4">
            <NavContainer />

          </div>
          
          {/* Profile section */}
          <div className="flex-shrink-0">
            <ProfileContainer />
          </div>
          <ToggleContainer/>
{/* //mobile screeen */}
          {/* <div className="sm:hidden">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div> */}
        </div>
      </Container>
    </header>
  )
}

export default Header