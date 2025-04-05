import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { Lightbulb, Star, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Feedback = () => {
  const { tempId } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [experience, setExperience] = useState(''); // Would normally come from user profile

  // Fetch interview data and generate feedback
  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        // Get the interview session data
        const interviewRef = doc(db, "ai-mock-interviewer", tempId);
        const interviewSnap = await getDoc(interviewRef);

        if (!interviewSnap.exists()) {
          throw new Error("Interview session not found");
        }

        const interviewData = interviewSnap.data();
        setExperience(interviewData.experience || '3'); // Default to 3 years if not set

        // Check if feedback already exists
        if (interviewData.feedback) {
          setFeedbackData(interviewData.feedback);
          setLoading(false);
          return;
        }

        // Generate feedback using Gemini API if not exists
        const feedback = await generateGeminiFeedback(
          interviewData.qaPairs, 
          interviewData.role,
          interviewData.experience
        );

        // Save feedback to Firestore
        await setDoc(interviewRef, { feedback }, { merge: true });
        
        setFeedbackData(feedback);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching interview data:", error);
        toast.error("Failed to load feedback");
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [tempId]);

  // Generate feedback using Gemini API
  const generateGeminiFeedback = async (qaPairs, jobRole, experience) => {
    try {
      const feedbackItems = [];
      
      for (const qa of qaPairs) {
        if (!qa.answer) continue; // Skip unanswered questions

        const promptData = `
          Analyze this interview response and provide detailed feedback:
          
          Job Role: ${jobRole}
          Candidate Experience: ${experience} years
          Question: ${qa.question}
          User Answer: ${qa.answer}
          
          Please provide feedback in the following JSON format:
          {
            "question": "The original question",
            "userAnswer": "The user's answer",
            "strengths": ["list", "of", "strengths"],
            "improvements": ["list", "of", "improvement", "areas"],
            "score": 0-10,
            "idealAnswer": "An example of an ideal answer",
            "tips": ["specific", "tips", "for", "improvement"]
          }
        `;

        // In a real implementation, you would call your Gemini API endpoint here
        // const response = await fetchGeminiAPI(promptData);
        // const result = await response.json();
        
        // Mock response for demonstration
        const mockResponse = {
          question: qa.question,
          userAnswer: qa.answer,
          strengths: ["Good technical knowledge", "Clear communication"],
          improvements: ["Could provide more specific examples", "Should structure answer better"],
          score: Math.floor(Math.random() * 4) + 6, // Random score 6-9 for demo
          idealAnswer: `For ${jobRole} with ${experience} years experience, an ideal answer would discuss...`,
          tips: ["Use the STAR method", "Quantify achievements", "Relate to job requirements"]
        };

        feedbackItems.push(mockResponse);
      }

      // Calculate overall score
      const totalScore = feedbackItems.reduce((sum, item) => sum + item.score, 0);
      const averageScore = feedbackItems.length > 0 ? (totalScore / feedbackItems.length).toFixed(1) : 0;

      return {
        items: feedbackItems,
        overallScore: averageScore,
        summary: `Performance analysis for ${jobRole} interview`,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error("Error generating feedback:", error);
      throw error;
    }
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-transparent mx-auto"></div>
          <p className="text-gray-600 font-medium">Analyzing your interview</p>
          <p className="text-sm text-gray-500">Generating personalized feedback...</p>
        </div>
      </div>
    );
  }

  if (!feedbackData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Feedback Not Available</h2>
          <p className="text-gray-600 mb-4">
            We couldn't generate feedback for this interview session. This might be because no answers were recorded.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Feedback</h1>
          <p className="text-gray-600">
            Detailed analysis of your interview performance
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Overall Performance</h2>
              <p className="text-gray-600 text-sm">
                Based on {feedbackData.items.length} answered questions
              </p>
            </div>
            <div className="flex items-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${feedbackData.overallScore * 10}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {feedbackData.overallScore}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Items */}
        <div className="space-y-4">
          {feedbackData.items.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    item.score >= 8 ? 'bg-green-100 text-green-600' : 
                    item.score >= 6 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    <span className="font-bold">{item.score}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 line-clamp-1">{item.question}</h3>
                </div>
                {expandedQuestion === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedQuestion === index && (
                <div className="p-5 pt-0 border-t border-gray-100 space-y-5">
                  {/* User Answer */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Your Answer</h4>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{item.userAnswer}</p>
                  </div>

                  {/* Strengths */}
                  {item.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        {item.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {item.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {item.improvements.map((improvement, i) => (
                          <li key={i} className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ideal Answer */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Suggested Answer</h4>
                    <p className="text-gray-800 bg-blue-50 p-3 rounded-lg">{item.idealAnswer}</p>
                  </div>

                  {/* Tips */}
                  {item.tips.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Tips for Improvement</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.tips.map((tip, i) => (
                          <div key={i} className="flex items-start bg-gray-50 p-3 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Takeaways</h3>
              <p className="text-gray-600 mb-4">
                Based on your overall performance, here are some recommendations for your next interview:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">Focus on providing specific examples from your {experience} years of experience</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">Practice structuring answers using the STAR method</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">Review technical concepts related to the job role</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;