import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
const Homepage = () => {
  const { userId } = useAuth();
  return (
    <div className=" text-black font-sans min-h-screen">
      {/* Hero Section - adjusted padding to account for fixed header */}
      <div className="pt-24">
        {" "}
        {/* Add padding-top to avoid content overlap with the header */}
        <div className="container mx-auto px-6 pb-24 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Master Your Interview Skills with AI
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Prepare for your dream job with personalized AI interviews that
              adapt to your industry, provide real-time feedback, and help you
              gain confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={userId ? "/generate" : "/login"}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full text-white text-lg font-semibold transition-all shadow-lg shadow-blue-900/50"
              >
                {userId ? "Start Your Interview" : "Please Login to Start"}
              </Link>

              <Link
                to="/demo"
                className="bg-white border border-gray-300 hover:bg-gray-50 px-8 py-4 rounded-full text-gray-700 text-lg font-semibold transition-all shadow-sm"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Features Section with Glowing Cards */}
        <div className="container mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold text-center mb-16 relative">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              The Future of Interview Prep
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Real-Time Feedback</h3>
              <p className="text-gray-600">
                Get instant feedback on your answers, tone, and body language.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">
                Customizable Interviews
              </h3>
              <p className="text-gray-600">
                Tailor your mock interviews to match your target job role.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Boost Confidence</h3>
              <p className="text-gray-600">
                Practice until you feel confident and ready for the real thing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
