import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";
import { Briefcase, Clock, ArrowRight, Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig"; 
const Cards = ({ role, time, tempId }) => { 
  const deleteCard = async () => {
    try {
      if (!tempId) {
        console.error("Error: tempId is undefined.");
        return;
      }

      const documentRef = doc(db, "ai-mock-interviewer", tempId);

      await deleteDoc(documentRef);

      console.log("Document successfully deleted!");
      window.location.reload(); // Refresh the page to reflect the changes
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const capitalizedRole = capitalizeFirstLetter(role);

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative"
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }} 
    >
      <button
        onClick={deleteCard}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
        aria-label="Delete"
      >
        <Trash2 className="h-5 w-5 text-red-600 hover:text-red-700" />
      </button>

      <div className="flex items-center space-x-4">
        <div className="p-3 bg-purple-50 rounded-lg">
          <Briefcase className="h-6 w-6 text-purple-600" /> 
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{capitalizedRole}</h3>
      </div>

      <div className="border-b border-gray-200 my-4"></div>

      <div className="space-y-2">
        <p className="text-gray-600 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" /> {/* Time Icon */}
          {time}
        </p>
      </div>

      <div className="mt-6">
        <Link to={`/interview/${tempId}`}>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-gray-900"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" /> 
          </Button>
        </Link>
      </div>
      <div>

        <Link to={`/feedback/${tempId}`} className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"/>
      </div>
    </motion.div>
  );
};

export default Cards;