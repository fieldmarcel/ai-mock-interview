import React, { useState, useRef,useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Mic, MicOff, Award, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../config/FirebaseConfig';
const InterviewPreparationPage = () => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [interview, setInterview] = useState("")
  const webcamRef = useRef(null);
  const { tempId } = useParams();
  const getData = async () => {
    try {
      const docRef = doc(db, 'ai-mock-interviewer', tempId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        setInterview(docSnap.data());
      } else {
        console.log('No such document!');
        toast.error('Interview not found', {
          description: 'We couldn\'t find this interview session.',
        });
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Connection error', {
        description: 'Failed to load interview data.',
      });
    }
  };

  useEffect(() => {
    getData();
  }, [tempId]);

  const handleStartWebcam = () => {
    setWebcamEnabled(true);
  };
  
  return (
    <div className="max-w-6xl mx-auto py-8">
        <div className='flex flex-row justify-between'> 
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Prepare for Your Interview</h2>
      <div className="flex justify-center">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!webcamEnabled}
              >
                Start Interview
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div></div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Interview Info & Instructions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Details</h3>
            <div className="space-y-4">
             
              <div>
                <p className="text-gray-500 text-sm mb-1">Position</p>
                <p className="text-gray-900 font-medium">{interview.role}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Tech Stack</p>
                <p className="text-gray-900 font-medium">{interview.description}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Experience</p>
                <p className="text-gray-900 font-medium">{interview.experience}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Number of Questions</p>
                <p className="text-gray-900 font-medium">{10}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Interview Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Award className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-900">Find a quiet environment with good lighting</span>
              </li>
              <li className="flex items-start">
                <Award className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-900">Dress professionally as you would for an in-person interview</span>
              </li>
              <li className="flex items-start">
                <Award className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-900">Speak clearly and maintain eye contact with the camera</span>
              </li>
              <li className="flex items-start">
                <Award className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-900">Prepare examples of your experience and achievements</span>
              </li>
              <li className="flex items-start">
                <Award className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-900">Structure answers using the STAR method (Situation, Task, Action, Result)</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Before You Begin</h3>
            <p className="text-gray-700 mb-4">
              This AI interview will simulate a real interview experience. Your responses will be recorded for review and feedback.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span>Make sure your camera and microphone are working properly</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span>Check that your face is clearly visible in the camera preview</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span>Test your microphone by speaking before starting</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Right Column - Camera/Mic Options */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Camera Preview</h3>
            
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              {webcamEnabled ? (
                <Webcam
                  ref={webcamRef}
                  mirrored={true}
                  onUserMedia={() => setWebcamEnabled(true)}
                  onUserMediaError={() => {
                    setWebcamEnabled(false);
                    alert("Failed to access your camera. Please check permissions.");
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-4">Camera access required</p>
                  <Button 
                    onClick={handleStartWebcam}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Enable Camera
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="font-medium text-gray-900">Device Settings</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setWebcamEnabled(!webcamEnabled)}
                  variant="outline" 
                  className={`border ${webcamEnabled ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-300 text-gray-700'} rounded-lg flex items-center justify-center h-12`}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {webcamEnabled ? 'Camera On' : 'Enable Camera'}
                </Button>
                
                <Button 
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  variant="outline" 
                  className={`border ${audioEnabled ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-300 text-gray-700'} rounded-lg flex items-center justify-center h-12`}
                >
                  {audioEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                  {audioEnabled ? 'Mic On' : 'Enable Mic'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Requirements</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center mr-3">✓</div>
                <div>
                  <p className="font-medium">Webcam</p>
                  <p className="text-sm text-gray-500">Required for visual recording</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center mr-3">✓</div>
                <div>
                  <p className="font-medium">Microphone</p>
                  <p className="text-sm text-gray-500">Required for audio recording</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center mr-3">✓</div>
                <div>
                  <p className="font-medium">Stable Internet Connection</p>
                  <p className="text-sm text-gray-500">Required for uninterrupted interview</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center mr-3">✓</div>
                <div>
                  <p className="font-medium">Chrome, Firefox, or Edge browser</p>
                  <p className="text-sm text-gray-500">For best compatibility</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Ready to Begin?</h3>
              <div className={`px-3 py-1 rounded-full text-sm ${webcamEnabled && audioEnabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {webcamEnabled && audioEnabled ? 'Ready' : 'Setup Required'}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Once you start the interview, you'll be presented with questions one by one. 
              Take your time to answer thoroughly, and click "Next" when you're ready to proceed.
            </p>
            
            <div className="flex justify-center">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!webcamEnabled}
              >
                Start Interview
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPreparationPage;