import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { generateFeedback, generateIdealAnswer, compareAnswers } from "../lib/GeminiAiModel";
import { ArrowLeft, Star, TrendingUp, AlertCircle, CheckCircle, Clock, MessageSquare, Zap, Target, Users, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Feedback = () => {
  const { tempId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [idealAnswers, setIdealAnswers] = useState({});
  const [comparisons, setComparisons] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [overallScore, setOverallScore] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showIdealAnswers, setShowIdealAnswers] = useState({});

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
        await generateComprehensiveFeedback(interviewInfo, userAnswersData);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load interview data");
    } finally {
      setLoading(false);
    }
  };

  const generateComprehensiveFeedback = async (interviewInfo, answers) => {
    try {
      setAnalyzing(true);
      
      // Generate ideal answers and comparisons for each question
      const idealAnswersMap = {};
      const comparisonsMap = {};
      let totalScore = 0;
      
      for (const answer of answers) {
        // Generate ideal answer for this question
        const idealAnswer = await generateIdealAnswer(
          answer.question,
          interviewInfo.role,
          interviewInfo.description,
          interviewInfo.experience
        );
        
        idealAnswersMap[answer.id] = idealAnswer;
        
        // Compare user answer with ideal answer
        const comparison = await compareAnswers(
          answer.question,
          idealAnswer,
          answer.answer,
          interviewInfo.role
        );
        
        comparisonsMap[answer.id] = comparison;
        totalScore += comparison.score || 0;
      }
      
      setIdealAnswers(idealAnswersMap);
      setComparisons(comparisonsMap);
      
      // Calculate overall score
      const avgScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;
      setOverallScore(avgScore);
      
      // Generate overall feedback
      const overallFeedback = await generateFeedback(interviewInfo, answers);
      setFeedback(overallFeedback.feedback);
      
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate AI feedback");
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleQuestionExpand = (answerId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [answerId]: !prev[answerId]
    }));
  };

  const toggleIdealAnswer = (answerId) => {
    setShowIdealAnswers(prev => ({
      ...prev,
      [answerId]: !prev[answerId]
    }));
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

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Satisfactory";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
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
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
              
              <div className={`px-6 py-4 rounded-xl border-2 ${getScoreBgColor(overallScore)}`}>
                <div className="text-center">
                  <span className="text-sm text-gray-600 font-medium">Overall Score</span>
                  <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}/100
                  </div>
                  <span className="text-xs text-gray-600">{getScoreLabel(overallScore)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {analyzing ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-green-500 border-r-green-300 border-b-green-200 border-l-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">AI is analyzing your responses...</p>
            <p className="text-sm text-gray-500 mt-2">Generating ideal answers and detailed comparisons</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Questions & Detailed Comparison */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Detailed Answer Analysis
                </h2>
                
                <div className="space-y-4">
                  {userAnswers.map((answer, index) => {
                    const comparison = comparisons[answer.id];
                    const idealAnswer = idealAnswers[answer.id];
                    const isExpanded = expandedQuestions[answer.id];
                    const showIdeal = showIdealAnswers[answer.id];
                    
                    return (
                      <div key={answer.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
                        {/* Question Header */}
                        <div 
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer"
                          onClick={() => toggleQuestionExpand(answer.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{answer.question}</h3>
                                {comparison && (
                                  <div className="flex items-center gap-3 mt-2">
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(comparison.score)}`}>
                                      <span className={getScoreColor(comparison.score)}>
                                        {comparison.score}/100
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-600">
                                      {getScoreLabel(comparison.score)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="p-4 space-y-4">
                            {/* Your Answer */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                Your Answer
                              </h4>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                                  {answer.answer}
                                </p>
                              </div>
                            </div>

                            {/* Ideal Answer Toggle */}
                            <div>
                              <button
                                onClick={() => toggleIdealAnswer(answer.id)}
                                className="flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 mb-2"
                              >
                                {showIdeal ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                {showIdeal ? 'Hide' : 'Show'} Ideal Answer
                              </button>
                              
                              {showIdeal && idealAnswer && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                                    {idealAnswer}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Comparison Analysis */}
                            {comparison && (
                              <div className="space-y-3">
                                {/* Strengths */}
                                {comparison.strengths && comparison.strengths.length > 0 && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4" />
                                      Strengths
                                    </h4>
                                    <ul className="space-y-1">
                                      {comparison.strengths.map((strength, i) => (
                                        <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                          <span className="text-green-600 mt-0.5">✓</span>
                                          <span>{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Areas for Improvement */}
                                {comparison.improvements && comparison.improvements.length > 0 && (
                                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4" />
                                      Areas for Improvement
                                    </h4>
                                    <ul className="space-y-1">
                                      {comparison.improvements.map((improvement, i) => (
                                        <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                                          <span className="text-orange-600 mt-0.5">→</span>
                                          <span>{improvement}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Specific Feedback */}
                                {comparison.feedback && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Detailed Feedback</h4>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                      {comparison.feedback}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overall Summary */}
              {feedback && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Overall Performance Summary
                  </h2>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                      {feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Metrics & Recommendations */}
            <div className="space-y-6">
              {/* Score Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Score Breakdown
                </h2>
                
                <div className="space-y-3">
                  {userAnswers.map((answer, index) => {
                    const comparison = comparisons[answer.id];
                    const score = comparison?.score || 0;
                    
                    return (
                      <div key={answer.id} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 font-medium">Q{index + 1}</span>
                          <span className={`font-bold ${getScoreColor(score)}`}>
                            {score}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              score >= 80 ? 'bg-green-500' : 
                              score >= 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Recommendations */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Key Recommendations
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Review ideal answers to understand expected depth</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Use STAR method for behavioral questions</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Include specific examples and metrics</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Practice questions that scored below 70</span>
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
        )}
      </div>
    </div>
  );
};

export default Feedback;