import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120); 
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const webcamRef = useRef(null);       
  const timerRef = useRef(null);
  
const fetchInterviewQues = async()=>{


     

}  
 
    return (
      <div>StartInterview</div>
    )
  }
export default StartInterview;



