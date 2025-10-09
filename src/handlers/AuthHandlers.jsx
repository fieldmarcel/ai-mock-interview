import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from '../firebase'; 
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
          const userRef = db.collection("users").doc(user.id);

          const userSnapshot = await userRef.get();

          if (!userSnapshot.exists) {

            const userData = {
              id: user.id,
              name: user.firstName || "N/A",
              email: user.emailAddresses[0]?.emailAddress || "N/A",
              imageUrl: user.profileImageUrl || "N/A",
              createdAt: new Date(),
              updatedAt: new Date()
            };

            await userRef.set(userData, { merge: true });
            console.log("User created successfully:", userData);
          } else {

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




