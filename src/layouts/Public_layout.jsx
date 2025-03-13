import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
const PublicLayout = () => {
  return (
    <div className='w-full'>
<Header/>
<Outlet/>
<Footer/>



    </div>
  )
}

export default PublicLayout