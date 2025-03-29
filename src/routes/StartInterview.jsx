import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Webcam from "react-webcam";
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

      console.log(qaPairs);

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

  const questionState = async () => {};

  useEffect(() => {
    fetchInterviewQues();
  }, []);

  return (
    <div className="flex flex-row ">
      <div className="w-96 h-96 bg-white ">
        <h1 className="text-red-600">{position}</h1>
        {/* <li className='text-blue-600'>
  {questions.map((q, index) => {
    return <span key={index}>{q.ques} <br /></span>;
  })}
</li> */}
        <div className="flex flex-col items-center justify-center">
          <h1>question {currentQuestionIndex + 1}</h1>
          <h2>
            {currentQuestionIndex >= 0 && (
              <div className="text-blue-600">
                {questions.map((q, index) => (
                  <p key={index} className="text-blue-600">
                    {index === currentQuestionIndex && q.ques}
                  </p>
                ))}
              </div>
            )}
          </h2>
          <div className="flex flex-row items-center justify-center">
            {
              <Button
                onClick={handlePrevQue}
                disabled={currentQuestionIndex === 0}
              >
                {" "}
                Prev
              </Button>
            }
            {
              <Button
                onClick={handleNextQue}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                {" "}
                Next
              </Button>
            }{" "}
          </div>

          <div className="bg-blue-200">
            <Lightbulb className="text-red-500"/>

            <h3>Important note</h3>
            <p>
             Click on record answer adipisicing elit. Nemo
              vitae quidem, saepe eveniet porro officiis officia dolores quam
              doloremque quod voluptas unde, eaque reiciendis neque maiores
              atque rerum ducimus iusto.
            </p>
          </div>
        </div>
      </div>
      <div>
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
        />{" "}
      </div>

      <div></div>
    </div>
  );
};
export default StartInterview;
