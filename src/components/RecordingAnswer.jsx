import React from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import { generateResponse } from "../lib/GeminiAiModel";
import { Mic } from 'lucide-react';
import { Image,LucideAudioLines } from 'lucide-react'
import { Button } from './ui/Button';
import { toast } from 'sonner';
const RecordingAnswer = ({currentQuestionIndex,questions}) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

const saveUserAnswers= async()=>{
  if(isRecording){
    stopSpeechToText()
    if(userAnswer?.length<10){
      toast("Your answer is too short")
      return;    }

      const feedbackprompt="Question:"+currentQuestionIndex[currentQuestionIndex]?.questions[questions]+
      ", User Answer:"+userAnswer+", depending on question and user answer"+
      "please give us rating for answer and feedback as areas of improvement if any"+
      "in just 3-4-5 lines to improve it in JSON format with rating field and feedback field"
      const result = await generateResponse(feedbackprompt);
  
  console.log( "feedback is" ,result)
    }else{

    startSpeechToText()
    
  }
}

 return (
    <div className="recording-container">
      <Button 
        variant="outline" 
        className="my-10 flex items-center gap-2" 
        onClick={saveUserAnswers}
      >
        {isRecording ? (
          <>
            <Mic className="text-red-500" />
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic />
            <span>Start Recording</span>
          </>
        )}
      </Button>
      
      {isRecording && (
        <div className="recording-status">
          <h2 className='text-red-500 flex items-center gap-2'>
            <Mic /> Recording...
          </h2>
        </div>
      )}
      
      <div className="transcript">
        {results.length > 0 && (
          <div>
            <h3>Your Answer:</h3>
            <p>{userAnswer}</p>
          </div>
        )}
        {interimResult && <p className="interim">{interimResult}</p>}
      </div>
      
      {feedback && (
        <div className="feedback mt-4">
          <h3>Feedback:</h3>
          <pre>{JSON.stringify(feedback, null, 2)}</pre>
        </div>
      )}
      
      {error && <p className="error text-red-500">Error: {error}</p>}
    </div>
  );
};

export default RecordingAnswer;