import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import {  collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
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
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

  const StartInterview = () => {
  const { tempId } = useParams();

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [position, setPosition] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120); 
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const webcamRef = useRef(null);       
  const timerRef = useRef(null);
  
  const fetchInterviewQues = async () => {
    try {
      const q = query(collection(db, "ai-mock-interviewer"));
      const querySnapshot = await getDocs(q);
  
      let role = "";
      let qaPairs = [];
  
      querySnapshot.forEach((doc) => {
        if (doc.id === tempId) { // Fetch only the relevant interview
          role = doc.data().role;
          qaPairs = doc.data().qaPairs.map((qa, index) => ({
            id: index,
            ques: qa.question,
          }));
        }
      });
  
      
        setQuestions(qaPairs);
        setPosition(role);
    
    console.log(qaPairs)
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch interview questions.");
    }
  };
  

  const handlewebCam =async()=>{
    try {
      setRecording(true);
      toast.success("Your recording started")
    } catch (error) {
      console.error("error in recording")
    }
  }
 useEffect(() => {
 fetchInterviewQues()
 }, [])
 
    return (
      <div className='w-96 h-96 bg-white '>
<h1 className='text-red-600'>{position}</h1>
<li className='text-blue-600'>
  {questions.map((q, index) => {
    return <span key={index}>{q.ques} <br /></span>;
  })}
</li>

      </div> 
    )
  }
export default StartInterview;



