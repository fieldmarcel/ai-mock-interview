import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "/components/ui/sheet.jsx"
  import { Menu } from 'lucide-react'
const ToggleContainer = () => {
  return (
    <div>

<Sheet>
  <SheetTrigger><Menu/></SheetTrigger>
  <SheetContent >
    <SheetHeader>
      <SheetTitle>{
userId ? <Link
        to="/generate"
        className="text-gray-700 hover:text-red-600 transition duration-300 font-medium"
      >
        Take an Interview
      </Link> : <Link
        to="/login"
        className="text-gray-700 hover:text-red-600 transition duration-300 font-medium">Login to take an Interview </Link>
}</SheetTitle>
      <SheetDescription>
      <nav className="flex space-x-8 justify-center">
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

   </nav>
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>

    </div>
  )
}

export default ToggleContainer