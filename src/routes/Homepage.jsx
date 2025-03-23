import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { ArrowRight, Zap, Target, BarChart2 } from "lucide-react";

const Homepage = () => {
  const { userId } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  return (
    <div className="text-black font-sans min-h-screen ">
      {/* Hero Section */}
      <div className=" relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center gap-12"
          >
            {/* Left Column - Text Content */}
            <motion.div variants={itemVariants} className="md:w-3/5">
              <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-sm font-medium text-blue-600">AI-Powered Interview Prep</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Master Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Interview Skills</span> with AI
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Prepare for your dream job with personalized AI interviews that adapt to your industry, provide real-time feedback, and help you gain confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={userId ? "/generate" : "/login"}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full text-white text-lg font-semibold transition-all shadow-lg hover:shadow-blue-600/20 group"
                >
                  {userId ? "Start Your Interview" : "Login to Start"}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 px-8 py-4 rounded-full text-gray-700 text-lg font-semibold transition-all shadow-sm"
                >
                  Watch Demo
                </Link>
              </div>
              
              <div className="flex items-center mt-8 text-sm text-gray-500">
                <span className="inline-flex items-center mr-6">
                  <svg className="w-4 h-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free limited interviews
                </span>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:w-2/5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl transform rotate-3 scale-105"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="p-1 bg-gradient-to-r from-gray-100 to-gray-200 flex">
                    <div className="flex space-x-1.5 px-2 py-1">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">AI</div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">IntervueX</p>
                          <p className="text-xs text-gray-500">Technical Lead</p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-700 p-3 bg-white rounded-lg border border-gray-100">
                        Tell me about a challenging project you've worked on and how you overcame obstacles.
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-gray-50 p-4 rounded-lg mb-2 max-w-xs">
                        <div className="flex items-center justify-end mb-2">
                          <p className="text-sm font-medium mr-3">You</p>
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          In my previous role, I was tasked with...
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                        Recording in progress...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Features Section */}
        <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              The Future of Interview Prep
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Feedback</h3>
              <p className="text-gray-600">
                Get instant feedback on your answers, tone, and body language to improve your interview performance.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Customizable Interviews</h3>
              <p className="text-gray-600">
                Tailor your mock interviews to match your target job role, industry, and experience level.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Boost Confidence</h3>
              <p className="text-gray-600">
                Practice until you feel confident and ready for the real thing with detailed performance analytics.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;