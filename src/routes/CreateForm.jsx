import React from 'react'
import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'



const CreateForm = () => {
    const { interviewId } = useParams()
  const [interview, setInterview] = useState(null)
    const [loading, setLoading] = useState(true)

  return (
    <div>



  

    </div>
  )
}

export default CreateForm