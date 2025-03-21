// import React from 'react'
import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'
import ForMockInterview from '../components/AddNewInterview'


// const CreateForm = () => {
    const { interviewId } = useParams()
  const [interview, setInterview] = useState(null)
    const [loading, setLoading] = useState(true)

useEffect(() => {

const fetchInterview = async () => {
  if(interviewId) {
    try {
      const interviewDoc = await getDoc(doc(db,"interviews",interviewId));
      if(interviewDoc.exists()){
        setInterview({...interviewDoc.data()})
        setLoading(false)
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
   
  }
}

fetchInterview();

}, [interviewId])



  return (
    <div className='my-4 flex-col w-full'>
      <ForMockInterview initialData={interview}/>
    </div>
  )
// }

// export default CreateForm




// import { collection,addDoc,doc,getDoc, getFirestore } from "firebase/firestore";
// import { app } from "../config/FirebaseConfig";
// import React from 'react';

// const firestore = getFirestore(app);

// const CreateForm = () => {
//   const writedata = async () => {
//     try {
//       const doc = await addDoc(collection(firestore, "ai-mock-interviewer"), {
//         name: "thailand",
//         country: "esrt",
//         pincode: "230066"
//       });
//       console.log("Document written with ID: ", doc.id);
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   };

//   const getdocument = async()=>{
//     const ref=  doc(firestore, "ai-mock-interviewer/yK0OelZIX5rIJIX4gBEj");
//     const snap= await getDoc(ref);
//     console.log("snap",snap.data())

//   }

// const writesubdata=async()=>{
//   try {
//     const docRef = await addDoc(collection(firestore, "cities/5jyZLuhyPezNBWHZEPL6/places"), {
//       city: "delhi",
//       location: "rajauri garden",
//       pincode: "110027"
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
// }
//   return (
//     <div>
//       <h1>Firebase Firestore</h1>
//       <button className="bg-black text-white" onClick={writedata}>
//         Add data
//       </button>
//       <button className="bg-black text-white" onClick={writesubdata}>
//         Add subdata
//       </button>
//       <button className="bg-black text-white" onClick={getdocument}>
//         get document
//       </button>
//     </div>
//   );
// };


// export default CreateForm;