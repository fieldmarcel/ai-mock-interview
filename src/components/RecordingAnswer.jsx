import React from 'react'
import useSpeechToText from 'react-hook-speech-to-text';

import { Image,LucideAudioLines } from 'lucide-react'
import { Button } from './ui/Button';
import { toast } from 'sonner';
const RecordingAnswer = () => {
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
  }else{
    startSpeechToText()
    if(userAnswer?.length<10){
      toast("Your answer is too short")
      return;
    }else{

    }
  }
}

  return (
    <div>

<div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop ' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
<Button variant="outline" className={"my-10"} onClick={isRecording?stopSpeechToText:startSpeechToText}></Button>
{isRecording ? <h2 className='text-red-500'><Mic/> Recording</h2>: "Record Answer" }  </div>
  )
}

export default RecordingAnswer