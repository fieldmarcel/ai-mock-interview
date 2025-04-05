import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Save, Send, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'sonner';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const RecordingAnswer = ({ 
  currentQuestionIndex, 
  question, 
  tempId,
  isLastQuestion,
  onAnswerSaved,
  onSubmitAll,
  onStartRecording,
  onStopRecording
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Update answer when transcript changes
  useEffect(() => {
    if (!listening && transcript) {
      setUserAnswer(prev => {
        return prev ? `${prev} ${transcript}` : transcript;
      });
      resetTranscript();
    }
  }, [listening, transcript]);

  const handleRecording = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsPaused(true);
      onStopRecording();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsPaused(false);
      onStartRecording();
    }
  };

  const saveAnswer = async () => {
    if (!userAnswer || userAnswer.trim().length < 1) {
      toast.error("Please provide an answer before saving");
      return;
    }

    setIsProcessing(true);
    try {
      await saveToFirebase(userAnswer);
      onAnswerSaved(currentQuestionIndex);
      toast.success("Answer saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save answer");
    } finally {
      setIsProcessing(false);
      if (listening) {
        SpeechRecognition.stopListening();
        onStopRecording();
      }
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

  const resetAnswer = () => {
    setUserAnswer('');
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <p className="font-medium">Speech Recognition Not Available</p>
        <p className="text-sm mt-1">Your browser doesn't support speech recognition. Please use Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">Your Answer:</h3>
        <div className="flex items-center space-x-2">
          {!isMicrophoneAvailable && (
            <div className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Mic blocked
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetAnswer}
            disabled={!userAnswer || isProcessing}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className={`p-4 rounded-lg border min-h-28 max-h-44 overflow-y-auto transition-colors ${listening ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
        {listening ? (
          <p className="whitespace-pre-wrap text-gray-800 text-sm">{transcript}</p>
        ) : userAnswer ? (
          <p className="whitespace-pre-wrap text-gray-800 text-sm">{userAnswer}</p>
        ) : (
          <p className="text-gray-400 italic text-sm">No answer recorded yet</p>
        )}
        
        {listening && (
          <div className="mt-2 flex items-center">
            <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="ml-2 text-xs text-blue-600">Recording...</span>
          </div>
        )}
        {isPaused && !listening && userAnswer && (
          <div className="mt-2 flex items-center">
            <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
            <span className="ml-2 text-xs text-yellow-600">Paused</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={listening ? "destructive" : "outline"}
          className={`flex-1 flex items-center justify-center gap-1 ${listening ? 'bg-red-500 hover:bg-red-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
          onClick={handleRecording}
          disabled={isProcessing || !isMicrophoneAvailable}
          size="sm"
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          <span className="text-xs font-medium">{listening ? "Stop" : isPaused ? "Resume" : "Record"}</span>
        </Button>

        <Button 
          variant="outline"
          className="flex-1 flex items-center justify-center gap-1 border-green-300 text-green-700 hover:bg-green-50"
          onClick={saveAnswer}
          disabled={listening || !userAnswer || isProcessing}
          size="sm"
        >
          <Save className="h-4 w-4" />
          <span className="text-xs font-medium">Save</span>
        </Button>

        {isLastQuestion && (
          <Button 
            className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={onSubmitAll}
            disabled={isProcessing}
            size="sm"
          >
            <Send className="h-4 w-4" />
            <span className="text-xs font-medium">Submit All</span>
          </Button>
        )}
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Saving your answer...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingAnswer;