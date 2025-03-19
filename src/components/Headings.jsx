import React from 'react'
import { Button } from './ui/Button'

const Headings = ({ title, description, subHeading = false }) => {
  return (
    <>
      {title && (
        <h1 className='text-4xl sm:text-5xl text-gray-800 font-semibold font-sans'>
          {title}
        </h1>
      )}
      {subHeading && (
        <h2 className='text-2xl sm:text-3xl text-gray-800 font-semibold font-sans'>
          {subHeading}
        </h2>
      )}
      {description && <p>{description}</p>}
      <div></div>
    </>
  )
}

export default Headings
