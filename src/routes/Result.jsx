import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/FirebaseConfig'
import {
  Star,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  BarChart2,
  MessageSquare,
  Award,
  Lightbulb
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const Result = () => {
  const { tempId } = useParams()
  const location = useLocation()
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const docRef = doc(db, "ai-mock-interviewer", tempId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setInterviewData(docSnap.data())
        } else {
          toast.error("Interview data not found")
        }
      } catch (error) {
        console.error("Error fetching interview data:", error)
        toast.error("Failed to load results")
      } finally {
        setLoading(false)
      }
    }

    fetchInterviewData()
  }, [tempId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!interviewData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your interview results. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Calculate overall rating
  const overallRating = interviewData.userAnswers 
    ? (interviewData.userAnswers.reduce((sum, answer) => sum + (answer.rating || 0), 0) / interviewData.userAnswers.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 md:mb-0"
            >
              <ChevronLeft className="mr-1" />
              Back to Interview
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Interview Results: <span className="text-indigo-600">{interviewData.role}</span>
            </h1>
            <p className="text-gray-500 mt-1">Review your performance and feedback</p>
          </div>
          
          {/* Overall Score */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <Award className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Score</p>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-800 mr-2">{overallRating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={18}
                      className={`${star <= overallRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BarChart2 className="mr-2" size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'answers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ClipboardList className="mr-2" size={16} />
            Detailed Answers
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'tips' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Lightbulb className="mr-2" size={16} />
            Improvement Tips
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Performance Metrics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <BarChart2 className="text-indigo-600 mr-2" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Questions Answered</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {interviewData.userAnswers?.length || 0}/{interviewData.qaPairs?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Response Length</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {interviewData.userAnswers 
                      ? Math.round(interviewData.userAnswers.reduce((sum, answer) => sum + answer.userAnswer.split(' ').length, 0) / interviewData.userAnswers.length)
                      : 0} words
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Strongest Area</p>
                  <p className="text-xl font-bold text-gray-800">
                    {interviewData.userAnswers?.length > 0 
                      ? interviewData.userAnswers.reduce((max, answer) => 
                          answer.rating > max.rating ? answer : max
                        ).questionText.substring(0, 30) + '...'
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <CheckCircle className="text-green-600 mr-2" />
                Your Strengths
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                    <CheckCircle className="text-green-600" size={14} />
                  </div>
                  <span className="text-gray-700">Clear communication style</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                    <CheckCircle className="text-green-600" size={14} />
                  </div>
                  <span className="text-gray-700">Good use of examples</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                    <CheckCircle className="text-green-600" size={14} />
                  </div>
                  <span className="text-gray-700">Appropriate response length</span>
                </li>
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <AlertCircle className="text-amber-500 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-amber-100 p-1 rounded-full mr-2 mt-0.5">
                    <AlertCircle className="text-amber-500" size={14} />
                  </div>
                  <span className="text-gray-700">Use more specific metrics</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-1 rounded-full mr-2 mt-0.5">
                    <AlertCircle className="text-amber-500" size={14} />
                  </div>
                  <span className="text-gray-700">Reduce filler words</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-1 rounded-full mr-2 mt-0.5">
                    <AlertCircle className="text-amber-500" size={14} />
                  </div>
                  <span className="text-gray-700">Structure answers more clearly</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'answers' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {interviewData.userAnswers?.map((answer, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Question {index + 1}: {answer.questionText}
                  </h3>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        size={16}
                        className={`${star <= answer.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} mx-0.5`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User's Answer */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <MessageSquare className="text-indigo-600 mr-2" size={16} />
                      Your Answer
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="whitespace-pre-wrap text-gray-700">{answer.userAnswer}</p>
                    </div>
                  </div>

                  {/* Feedback & Ideal Answer */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Lightbulb className="text-amber-500 mr-2" size={16} />
                      Feedback & Ideal Answer
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-700 font-medium mb-2">Feedback:</p>
                      <p className="text-blue-700 mb-4">{answer.feedback}</p>
                      
                      <p className="text-blue-700 font-medium mb-2">Ideal Answer Structure:</p>
                      <p className="text-blue-700">
                        {interviewData.qaPairs[index]?.idealAnswer || 
                        "A good answer would include: Situation (context), Task (your role), Action (steps taken), and Result (outcome with metrics if possible)."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'tips' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-6 flex items-center">
              <Lightbulb className="text-amber-500 mr-2" />
              Personalized Improvement Plan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Communication Tips */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Communication</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-0.5">
                      <MessageSquare className="text-indigo-600" size={14} />
                    </div>
                    <span className="text-gray-700">Practice pausing instead of using filler words</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-0.5">
                      <MessageSquare className="text-indigo-600" size={14} />
                    </div>
                    <span className="text-gray-700">Record yourself to monitor speaking pace</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-0.5">
                      <MessageSquare className="text-indigo-600" size={14} />
                    </div>
                    <span className="text-gray-700">Use vocal variety to emphasize key points</span>
                  </li>
                </ul>
              </div>

              {/* Content Tips */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Content</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                      <ClipboardList className="text-green-600" size={14} />
                    </div>
                    <span className="text-gray-700">Prepare 3-5 specific examples of achievements</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                      <ClipboardList className="text-green-600" size={14} />
                    </div>
                    <span className="text-gray-700">Quantify results whenever possible</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                      <ClipboardList className="text-green-600" size={14} />
                    </div>
                    <span className="text-gray-700">Structure answers using STAR method</span>
                  </li>
                </ul>
              </div>

              {/* Practice Recommendations */}
              <div className="md:col-span-2 mt-4">
                <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Practice Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h5 className="font-medium text-indigo-700 mb-2">Mock Interviews</h5>
                    <p className="text-gray-700 text-sm">Schedule 2-3 mock interviews per week focusing on different question types</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h5 className="font-medium text-green-700 mb-2">Recording Practice</h5>
                    <p className="text-gray-700 text-sm">Record answers to common questions and review for improvements</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h5 className="font-medium text-amber-700 mb-2">Peer Feedback</h5>
                    <p className="text-gray-700 text-sm">Practice with a friend and exchange constructive feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center">
            <ClipboardList className="mr-2" />
            Download Full Report
          </button>
          <button className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center">
            <RefreshCw className="mr-2" />
            Retake Interview
          </button>
        </div>
      </div>
    </div>
  )
}

export default Result