import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
const Public_layout = () => {
  return (
    <div className='w-full'>
<Header/>
<Outlet/>
<Footer/>



    </div>
  )
}

export default Public_layout