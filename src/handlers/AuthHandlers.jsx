import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from '../firebase'; // Import your Firestore instance
import LoaderPage from '../routes/LoaderPage';

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storeUserData = async () => {
      if (isSignedIn && user) {
        setLoading(false);
        try {
          // Get the user reference from Firestore
          const userRef = db.collection("users").doc(user.id);

          // Get the user data directly
          const userSnapshot = await userRef.get();

          // Check if the user already exists
          if (!userSnapshot.exists) {
            // User data object
            const userData = {
              id: user.id,
              name: user.firstName || "N/A",
              email: user.emailAddresses[0]?.emailAddress || "N/A",
              imageUrl: user.profileImageUrl || "N/A",
              createdAt: new Date(),
              updatedAt: new Date()
            };

            // Insert the new user data
            await userRef.set(userData, { merge: true });
            console.log("User created successfully:", userData);
          } else {
            // User already exists, log the existing data
            console.log("User already exists:", userSnapshot.data());
          }
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      }
    };

    storeUserData();
  }, [isSignedIn, user, pathname, navigate]);

  if (loading) {
    return (
      <div>
        <LoaderPage />
      </div>
    );
  }

  return null;
};

export default AuthHandler;





// import { useAuth } from '../context/AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { useUser } from '@clerk/clerk-react';
// import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../firebase'; // Make sure to import your Firestore instance
// import LoaderPage from '../routes/LoaderPage';

// const AuthHandler = () => {
//   const { isSignedIn } = useAuth();
//   const { user } = useUser();
//   const pathname = useLocation().pathname;
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUserdata = async () => {
//       if (isSignedIn && user) {
//         setLoading(false);
//         try {
//           // Get user document from Firestore
//           const userDoc = await getDoc(doc(db, "users", user.id));

//           // Check if the user exists
//           if (!userDoc.exists()) {
//             // Prepare user data
//             const userData = {
//               id: user.id,
//               name: user.firstName || "N/A",
//               email: user.emailAddresses[0]?.emailAddress || "N/A",
//               imageUrl: user.profileImageUrl || "N/A",
//               createdAt: serverTimestamp(),
//               updatedAt: serverTimestamp()
//             };

//             // Store user data in Firestore with merge option
//             await setDoc(doc(db, "users", user.id), userData, { merge: true });
//             console.log("User data stored successfully.");
//           } else {
//             console.log("User already exists:", userDoc.data());
//           }
//         } catch (error) {
//           console.log("Error on storage of user data", error);
//         }
//       }
//     };

//     storedUserdata();
//   }, [isSignedIn, user, pathname, navigate]);

//   if (loading) {
//     return (
//       <div>
//         <LoaderPage />
//       </div>
//     );
//   }

//   return null;
// };

// export default AuthHandler;
