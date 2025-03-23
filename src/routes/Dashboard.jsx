import React from "react";

import  { Suspense } from "react";
import Headings from "../components/Headings";
import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { userId } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const LazyCards = React.lazy(() => import("../components/Cards"));

  const fetchUserInterviews = async (userId) => {
    try {
      if (!userId) {
        console.log("User ID is undefined. Skipping Firestore query.");
        return [];
      }

      const q = query(collection(db, "ai-mock-interviewer"), where("createdBy", "==", userId));
      const querySnapshot = await getDocs(q);

      const data = [];
      querySnapshot.forEach((doc) => {
        const role = doc.data().role;
        const createdAt = doc.data().createdAt.toDate();
        const tempId = doc.id; 
        data.push({ role, createdAt, tempId }); // pushing data as  object
      });

      data.sort((a, b) => b.createdAt - a.createdAt);//if +ve then b  else a

      return data;
    } catch (error) {
      console.log("Error getting documents: ", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      const fetchedInterviews = await fetchUserInterviews(userId);
      setInterviews(fetchedInterviews);
    };

    fetchCards();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <Headings title="Dashboard" description="Create and manage your content" />
        </div>

        <Link to="/generate/create">
          <Button size="sm" className="cursor-pointer bg-black text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add new
          </Button>
        </Link>
      </div>

      {interviews.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <p>No recent activities to display.</p>
            <p className="mt-2 underline hover:text-gray-700 transition-colors">
              Get started by creating your first mock interview
            </p>
          </div>
        </div>
      )}

      {interviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
           <Suspense key={interview.tempId} fallback={<div><Loader/></div>}>
           <LazyCards
             role={interview.role}
             time={interview.createdAt.toLocaleString()}
             tempId={interview.tempId}
           />
         </Suspense>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;