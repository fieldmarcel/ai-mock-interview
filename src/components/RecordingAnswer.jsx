import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'sonner';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { useSpeechRecognition } from 'react-speech-recognition';

const RecordingAnswer = ({ 
  currentQuestionIndex, 
  question, 
  tempId,
  isLastQuestion,
  onAnswerSaved,
  onSubmitAll
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Using react-speech-recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Update user answer from speech recognition transcript
  useEffect(() => {
    setUserAnswer(transcript);
  }, [transcript]);

  const handleRecording = async () => {
    if (listening) {
      await stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (!isMicrophoneAvailable) {
      toast.error("Microphone access is not available");
      return;
    }
    
    setUserAnswer('');
    resetTranscript();
  };

  const stopRecording = async () => {
    if (!userAnswer || userAnswer.trim().length < 1) {
      toast.error("Please provide a longer answer");
      return;
    }

    setIsProcessing(true);
    try {
      await saveToFirebase(userAnswer);
      onAnswerSaved(currentQuestionIndex);
      console.log(`Answer saved for question ${currentQuestionIndex + 1}`);
      toast.success("Answer saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save answer");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToFirebase = async (answer) => {
    try {
      const answerRef = doc(collection(db, 'interview-answers'), 
        `${tempId}-q${currentQuestionIndex}`);
      
      await setDoc(answerRef, {
        questionId: currentQuestionIndex,
        question: question.ques,
        answer: answer,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Firebase error:", error);
      throw error;
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Your browser doesn't support speech recognition. Please use Chrome or Edge.
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
        Microphone access is blocked. Please allow microphone permissions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={listening ? "destructive" : "outline"}
          className="flex items-center gap-2 flex-1 min-w-[200px]"
          onClick={handleRecording}
          disabled={isProcessing}
        >
          <Mic className={listening ? "animate-pulse" : ""} />
          {listening ? "Stop Recording" : "Start Recording"}
          {isProcessing && <span className="ml-2">Processing...</span>}
        </Button>

        {isLastQuestion && (
          <Button 
            onClick={onSubmitAll}
            disabled={listening || !userAnswer || isProcessing}
            className="flex-1 min-w-[200px]"
          >
            Submit All Answers
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Your Answer:</h3>
        <div className="bg-gray-50 p-3 rounded border min-h-20 max-h-40 overflow-y-auto">
          {listening ? (
            transcript ? (
              <p className="whitespace-pre-wrap">{transcript}</p>
            ) : (
              <p className="text-gray-400 italic">Speak now, your answer will appear here...</p>
            )
          ) : (
            userAnswer ? (
              <p className="whitespace-pre-wrap">{userAnswer}</p>
            ) : (
              <p className="text-gray-400 italic">No answer recorded yet</p>
            )
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-2">
        {listening && (
          <p>Tip: Speak clearly in a quiet environment for best results</p>
        )}
      </div>
    </div>
  );
};

export default RecordingAnswer;