import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { generateFeedback } from "../lib/GeminiAiModel";

// import { generateFeedback } from "../lib/GeminiFeedbackAnalyzer";
import { ArrowLeft, Star, TrendingUp, AlertCircle, CheckCircle, Clock, MessageSquare, Zap, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Feedback = () => {
  const { tempId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    fetchInterviewData();
  }, [tempId]);

  const fetchInterviewData = async () => {
    try {
      setLoading(true);
      
      // Fetch interview questions
      const interviewQuery = query(collection(db, "ai-mock-interviewer"));
      const interviewSnapshot = await getDocs(interviewQuery);
      
      let interviewInfo = null;
      interviewSnapshot.forEach((doc) => {
        if (doc.id === tempId) {
          interviewInfo = {
            id: doc.id,
            ...doc.data()
          };
        }
      });

      if (!interviewInfo) {
        toast.error("Interview data not found");
        navigate("/");
        return;
      }

      // Fetch user answers
      const answersQuery = query(collection(db, "interview-answers"));
      const answersSnapshot = await getDocs(answersQuery);
      
      const userAnswersData = [];
      answersSnapshot.forEach((doc) => {
        if (doc.id.startsWith(tempId)) {
          userAnswersData.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });

      // Sort answers by questionId
      userAnswersData.sort((a, b) => a.questionId - b.questionId);

      setInterviewData(interviewInfo);
      setUserAnswers(userAnswersData);

      // Generate AI feedback if we have answers
      if (userAnswersData.length > 0) {
        await generateAIFeedback(interviewInfo, userAnswersData);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load interview data");
    } finally {
      setLoading(false);
    }
  };

  const generateAIFeedback = async (interviewInfo, answers) => {
    try {
      setAnalyzing(true);
      
      const feedbackData = await generateFeedback(interviewInfo, answers);
      setFeedback(feedbackData.feedback);
      setOverallScore(feedbackData.overallScore || calculateOverallScore(feedbackData.feedback));
      
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate AI feedback");
    } finally {
      setAnalyzing(false);
    }
  };

  const calculateOverallScore = (feedback) => {
    // Simple scoring logic based on feedback content
    if (!feedback) return 0;
    
    const positiveIndicators = ['excellent', 'good', 'strong', 'well', 'properly', 'correctly'];
    const negativeIndicators = ['poor', 'weak', 'lacking', 'improve', 'better'];
    
    let score = 70; // Base score
    const text = feedback.toLowerCase();
    
    positiveIndicators.forEach(indicator => {
      if (text.includes(indicator)) score += 3;
    });
    
    negativeIndicators.forEach(indicator => {
      if (text.includes(indicator)) score -= 3;
    });
    
    return Math.max(0, Math.min(100, score));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-transparent mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your interview results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/generate")}
            variant="outline"
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Interviews
          </Button>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Interview Feedback: {interviewData?.role}
                </h1>
                <p className="text-gray-600">
                  {interviewData?.description} • {interviewData?.experience} years experience
                </p>
              </div>
              
              <div className={`px-6 py-3 rounded-xl border-2 ${getScoreBgColor(overallScore)}`}>
                <div className="text-center">
                  <span className="text-sm text-gray-600 font-medium">Overall Score</span>
                  <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}/100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Questions & Answers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Answers Review */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Questions & Your Answers
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {userAnswers.map((answer, index) => (
                  <div key={answer.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{answer.question}</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">{answer.answer}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Answered on {answer.timestamp?.toDate()?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Detailed Analysis
              </h2>
              
              {analyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-green-500 border-r-green-300 border-b-green-200 border-l-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">AI is analyzing your responses...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              ) : feedback ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      AI Feedback Summary
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                      {feedback}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {feedback.includes('communication') && <li>• Clear communication skills</li>}
                        {feedback.includes('technical') && <li>• Strong technical knowledge</li>}
                        {feedback.includes('experience') && <li>• Relevant experience</li>}
                        {feedback.includes('confident') && <li>• Confident delivery</li>}
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Areas to Improve
                      </h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        {feedback.includes('more detail') && <li>• Add more specific examples</li>}
                        {feedback.includes('structure') && <li>• Improve answer structure</li>}
                        {feedback.includes('technical') && feedback.includes('weak') && <li>• Technical depth needed</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No feedback available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Metrics & Recommendations */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Performance Metrics
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-bold text-green-600">100%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Answer Length</span>
                  <span className="font-bold text-blue-600">Good</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Technical Depth</span>
                  <span className="font-bold text-yellow-600">Moderate</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Communication</span>
                  <span className="font-bold text-green-600">Strong</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Recommendations
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Practice STAR method for behavioral questions</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Include specific metrics in your answers</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Work on technical depth for role-specific questions</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Next Steps
              </h2>
              
              <div className="space-y-3">
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Practice Similar Questions
                </Button>
                
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                  Schedule Another Interview
                </Button>
                
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;