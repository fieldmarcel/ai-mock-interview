import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Webcam from "react-webcam";
import RecordingAnswer from "../components/RecordingAnswer";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import {
  Camera,
  Mic,
  MicOff,
  ChevronRight,
  ChevronLeft,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  ArrowRight,
  Settings,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const StartInterview = () => {
  const { tempId } = useParams();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [position, setPosition] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [prev, setPrev] = useState(true);
  const [next, setNext] = useState(true);

  const [recording, setRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('questions'); // For mobile tab navigation

  const webcamRef = useRef(null);
  const timerRef = useRef(null);

  const fetchInterviewQues = async () => {
    try {
      const q = query(collection(db, "ai-mock-interviewer"));
      const querySnapshot = await getDocs(q);

      let role = "";
      let qaPairs = [];

      querySnapshot.forEach((doc) => {
        if (doc.id === tempId) {
          // Fetch only the relevant interview
          role = doc.data().role;
          qaPairs = doc.data().qaPairs.map((qa, index) => ({
            id: index,
            ques: qa.question,
          }));
        }
      });

      setQuestions(qaPairs);
      setPosition(role);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch interview questions.");
    }
  };

  const handleRecording = async () => {
    try {
      setRecording(true);
      setAudioEnabled(true);
      toast.success("Your recording started");
    } catch (error) {
      console.error("error in recording");
    }
  };

  const handlePrevQue = async () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    else {
      setPrev(false);
    }
  };
  
  const handleNextQue = async () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    else {
      setNext(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsPaused(true);
  };

  const resumeTimer = () => {
    startTimer();
    setIsPaused(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  useEffect(() => {
    fetchInterviewQues();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto">
      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden mb-4 border-b border-gray-200">
        <button 
          className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} 
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
        <button 
          className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 'camera' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} 
          onClick={() => setActiveTab('camera')}
        >
          Camera
        </button>
        <button 
          className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 'recording' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} 
          onClick={() => setActiveTab('recording')}
        >
          Recording
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left column - Questions and controls */}
        <div className={`w-full md:w-1/3 bg-white rounded-lg shadow-md p-3 sm:p-4 ${activeTab !== 'questions' && 'hidden md:block'}`}>
          <h1 className="text-lg sm:text-xl font-bold text-blue-600 mb-3 truncate">{position} Interview</h1>
          
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base sm:text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
              <div className="text-sm bg-blue-100 px-2 py-1 rounded-full">
                {formatTime(timeRemaining)}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg border mb-3 max-h-32 sm:max-h-none overflow-y-auto">
            {currentQuestionIndex >= 0 && (
              <div className="text-gray-800 text-sm sm:text-base">
                {questions.map((q, index) => (
                  <p key={index} className={index === currentQuestionIndex ? "block" : "hidden"}>
                    {q.ques}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-row gap-2 mb-3">
            <Button
              onClick={handlePrevQue}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex-1 text-xs sm:text-sm py-1 h-8 sm:h-10"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>
            
            <Button
              onClick={handleNextQue}
              disabled={currentQuestionIndex === questions.length - 1}
              variant="outline"
              className="flex-1 text-xs sm:text-sm py-1 h-8 sm:h-10"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 mb-4">
            {!isPaused ? (
              <Button onClick={startTimer} className="flex-1 text-xs sm:text-sm py-1 h-8 sm:h-10" disabled={timeRemaining === 0}>
                <Play size={16} className="mr-1 h-4 w-4" />
                Start Timer
              </Button>
            ) : (
              <Button onClick={resumeTimer} className="flex-1 text-xs sm:text-sm py-1 h-8 sm:h-10" disabled={timeRemaining === 0}>
                <Play size={16} className="mr-1 h-4 w-4" />
                Resume
              </Button>
            )}
            
            <Button onClick={pauseTimer} className="flex-1 text-xs sm:text-sm py-1 h-8 sm:h-10" disabled={!timerRef.current || timeRemaining === 0}>
              <Pause size={16} className="mr-1 h-4 w-4" />
              Pause
            </Button>
          </div>

          <div className="bg-blue-100 p-3 rounded-lg flex items-start text-xs sm:text-sm">
            <Lightbulb className="text-blue-600 mr-2 mt-1 flex-shrink-0 h-4 w-4" />
            <div>
              <h3 className="font-semibold mb-1 text-sm">Important note</h3>
              <p className="text-gray-700">
                Click on "Start Recording" to begin answering. Speak clearly and provide 
                detailed responses.
              </p>
            </div>
          </div>
        </div>

        {/* Middle column - Camera view */}
        <div className={`w-full md:w-1/3 ${activeTab !== 'camera' && 'hidden md:block'}`}>
          <div className="bg-black rounded-lg overflow-hidden shadow-md aspect-video">
            <Webcam
              ref={webcamRef}
              mirrored={true}
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => {
                setWebcamEnabled(false);
                toast.error("Camera error", {
                  description:
                    "Could not access your camera. Please check permissions.",
                });
              }}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Timer overlay on webcam */}
          {timeRemaining < 30 && timeRemaining > 0 && (
            <div className="mt-2 bg-red-100 border border-red-300 text-red-600 p-2 rounded flex items-center justify-center animate-pulse text-sm">
              <Clock className="mr-2 h-4 w-4" />
              Time remaining: {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        {/* Right column - Recording interface */}
        <div className={`w-full md:w-1/3 ${activeTab !== 'recording' && 'hidden md:block'}`}>
          <RecordingAnswer 
            tempId={tempId} 
            currentQuestionIndex={currentQuestionIndex}
            questions={questions}
          />
        </div>
      </div>

      {/* Sticky footer navigation for mobile (alternative to tabs) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-2 flex justify-around">
        <button 
          onClick={() => {
            if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
          }} 
          disabled={currentQuestionIndex === 0}
          className={`flex flex-col items-center ${currentQuestionIndex === 0 ? 'text-gray-400' : 'text-blue-600'}`}
        >
          <ChevronLeft size={20} />
          <span className="text-xs">Prev</span>
        </button>
        
        <button 
          onClick={() => timeRemaining > 0 ? (isPaused ? resumeTimer() : startTimer()) : null} 
          className={`flex flex-col items-center ${timeRemaining === 0 ? 'text-gray-400' : 'text-blue-600'}`}
        >
          <Clock size={20} />
          <span className="text-xs">{formatTime(timeRemaining)}</span>
        </button>
        
        <button 
          onClick={() => {
            if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
          }} 
          disabled={currentQuestionIndex === questions.length - 1}
          className={`flex flex-col items-center ${currentQuestionIndex === questions.length - 1 ? 'text-gray-400' : 'text-blue-600'}`}
        >
          <ChevronRight size={20} />
          <span className="text-xs">Next</span>
        </button>
      </div>
      
      {/* Bottom padding to avoid content being hidden behind the sticky footer */}
      <div className="pb-16 md:pb-0"></div>
    </div>
  );
};

export default StartInterview;