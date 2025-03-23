import React, { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useAuth } from "@clerk/clerk-react";
import { Plus, ArrowRight, Clock, Loader } from "lucide-react";

import { db } from "../config/FirebaseConfig";
import { Button } from "../components/ui/Button";

const Dashboard = () => {
  const { userId } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const LazyCards = React.lazy(() => import("../components/Cards"));

  const fetchUserInterviews = async (userId) => {
    try {
      if (!userId) {
        console.log("User ID is undefined. Skipping Firestore query.");
        return [];
      }

      const q = query(
        collection(db, "ai-mock-interviewer"),
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      const data = [];
      querySnapshot.forEach((doc) => {
        const role = doc.data().role;
        const createdAt = doc.data().createdAt.toDate();
        const tempId = doc.id;

        data.push({ role, createdAt, tempId });
      });

      data.sort((a, b) => b.createdAt - a.createdAt);
      return data;
    } catch (error) {
      console.log("Error getting documents: ", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      const fetchedInterviews = await fetchUserInterviews(userId);
      setInterviews(fetchedInterviews);
      setIsLoading(false);
    };

    fetchCards();
  }, [userId]);

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Interview Dashboard</h1>
            <p className="text-gray-500">Manage and create interview simulations</p>
          </div>

          <Link to="/generate/create">
            <Button 
              size="lg" 
              className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-full"
            >
              <Plus className="h-5 w-5" />
              New Interview
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-r-indigo-300 border-b-indigo-600 border-l-indigo-300 animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading your interviews</p>
            </div>
          </div>
        ) : interviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-70"></div>
            
            <div className="relative z-10 text-center py-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No interviews yet</h2>
              <p className="text-gray-600 mb-8">
                Create your first mock interview to prepare for your next job opportunity.
              </p>
              
              <Link to="/generate/create">
                <Button className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2 mx-auto">
                  <span>Create First Interview</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800">Your Recent Interviews</h2>
              <p className="text-gray-500">{interviews.length} total</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <Suspense
                  key={interview.tempId}
                  fallback={
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 h-48 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full border-3 border-t-indigo-600 border-r-indigo-200 border-b-indigo-600 border-l-indigo-200 animate-spin"></div>
                    </div>
                  }
                >
                  <div className="transform hover:-translate-y-1 transition-all duration-300">
                    <LazyCards
                      role={interview.role}
                      time={interview.createdAt.toLocaleString()}
                      tempId={interview.tempId}
                    />
                  </div>
                </Suspense>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;