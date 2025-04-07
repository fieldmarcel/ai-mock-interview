import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import RecordingAnswer from "../components/RecordingAnswer";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { ChevronRight, ChevronLeft, Lightbulb, ArrowRight, Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const StartInterview = () => {
  const { tempId } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [position, setPosition] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState({});

  const webcamRef = useRef(null);

  // Derived state
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = Object.keys(savedAnswers).length === questions.length;

  const fetchInterviewQues = async () => {
    try {
      const q = query(collection(db, "ai-mock-interviewer"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (doc.id === tempId) {
          setPosition(doc.data().role);
          setQuestions(doc.data().qaPairs.map((qa, index) => ({
            id: index,
            ques: qa.question,
          })));
        }
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch interview questions.");
    }
  };

  // Question navigation
  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  };

  // Answer handling
  const handleAnswerSaved = (questionIndex) => {
    setSavedAnswers(prev => ({ ...prev, [questionIndex]: true }));
  };

  const handleSubmitAll = () => {
    if (!allQuestionsAnswered) {
      toast.error("Please answer all questions before submitting");
      return;
    }
    navigate(`/feedback/${tempId}`);
  };

  // Effects
  useEffect(() => {
    fetchInterviewQues();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-transparent mx-auto"></div>
          <p className="text-gray-600 font-medium">Preparing your interview session</p>
          <p className="text-sm text-gray-500">Loading questions for {position}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100  border-gray-300 border-2 rounded-3xl p-4 sm:p-6 max-w-7xl mx-auto font-inter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {position} Interview
        </h1>
        <p className="text-gray-500 mt-1">
          Practice makes perfect. Answer each question thoughtfully.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Webcam */}
        <div className="w-full xl:w-2/5 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
            <div className="p-5 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Your Camera</h2>
                <div className="flex items-center space-x-2">
                  {webcamEnabled ? (
                    <span className="flex items-center text-sm text-green-600">
                      <Camera className="h-4 w-4 mr-1" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-red-600">
                      <CameraOff className="h-4 w-4 mr-1" /> Disabled
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-900 relative">
              <Webcam
                ref={webcamRef}
                mirrored={true}
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={() => {
                  setWebcamEnabled(false);
                  toast.error("Camera access denied", {
                    description: "Please enable camera permissions in your browser settings.",
                  });
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {!webcamEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center p-6">
                    <CameraOff className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 font-medium">Camera is disabled</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Allow access to your camera for the best experience
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Questions */}
        <div className="w-full xl:w-3/5 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={isLastQuestion}
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-5 flex-1">
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
                <p className="text-lg font-medium text-gray-900">
                  {questions[currentQuestionIndex]?.ques}
                </p>
              </div>
              
              <RecordingAnswer 
                tempId={tempId} 
                currentQuestionIndex={currentQuestionIndex}
                question={questions[currentQuestionIndex]}
                isLastQuestion={isLastQuestion}
                onAnswerSaved={handleAnswerSaved}
                onSubmitAll={handleSubmitAll}
              />
            </div>
            
            <div className="p-5 bg-gray-50 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Interview Tip</h3>
                  <p className="text-gray-600 text-sm">
                    Structure your answers using the STAR method: Situation, Task, Action, Result. 
                    Keep responses concise (60-90 seconds) and focus on measurable outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex-1 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Your progress
        </span>
        <span className="text-sm font-medium text-blue-600">
          {Object.keys(savedAnswers).length}/{questions.length} completed
        </span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(Object.keys(savedAnswers).length / questions.length) * 100}%` }}
        />
      </div>
      
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Button
        onClick={() => navigate(`/feedback/${tempId}`)}
        variant="outline"
        className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
        size="lg"
      >
        View Feedback
      </Button>
      
      {allQuestionsAnswered && (
        <Button
          onClick={handleSubmitAll}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
          size="lg"
        >
          Complete Interview
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
</div>
      
      {/* Mobile Navigation */}
      <div className="xl:hidden fixed bottom-4 left-0 right-0 px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex justify-between">
          <Button 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            variant="ghost"
            className={`flex-1 ${currentQuestionIndex === 0 ? 'text-gray-400' : 'text-blue-600'}`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </Button>
          
          <Button 
            onClick={handleNextQuestion}
            disabled={isLastQuestion}
            variant="ghost"
            className={`flex-1 ${isLastQuestion ? 'text-gray-400' : 'text-blue-600'}`}
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
      
      <div className="pb-20 xl:pb-0"></div>
    </div>
  );
};

export default StartInterview;