import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Mic, MicOff, Award, ChevronRight, Info, CheckCircle, Settings, User, Clock, HelpCircle, BookOpen, Target } from 'lucide-react';
import { Button } from './ui/Button';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { db } from '../config/FirebaseConfig';
import { toast } from 'sonner';

const InterviewPreparationPage = () => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef(null);
  const { tempId } = useParams();

  const getData = async () => {
    try {
      const docRef = doc(db, 'ai-mock-interviewer', tempId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setInterview(docSnap.data());
      } else {
        toast.error('Interview not found', {
          description: 'The requested interview session could not be located.',
          action: {
            label: 'Go Home',
            onClick: () => window.location.href = '/'
          },
        });
      }
    } catch (error) {
      toast.error('Connection error', {
        description: 'Failed to load interview data. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [tempId]);

  const handleStartWebcam = async () => {
    try {
      setWebcamEnabled(true);
      toast.success('Camera enabled', {
        description: 'Your camera is now active and ready for the interview.',
      });
    } catch (error) {
      toast.error('Camera error', {
        description: 'Could not access your camera. Please check permissions.',
      });
    }
  };

  const handleToggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    toast.info(newState ? 'Microphone enabled' : 'Microphone disabled');
  };

  const handleStartClick = (e) => {
    if (!webcamEnabled) {
      e.preventDefault();
      toast.warning('Setup required', {
        description: 'Please enable your camera before starting the interview.',
        action: {
          label: 'Enable Camera',
          onClick: handleStartWebcam
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <Settings className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <Info className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Interview Not Found</h2>
          <p className="text-gray-600 mb-6">The interview session you're looking for doesn't exist or may have been deleted.</p>
          <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header Bar */}
      <header className="sm:w-5/6 sm:ml-32  bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-md sticky top-0 z-10 rounded-full border-b border-indigo-100 shadow-sm">
      <div className="sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
              <BookOpen className="sm:w-5 sm:h-5 text-indigo-600" />
            </div>
            Interview Preparation
          </h1>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full flex items-center text-sm font-medium shadow-sm border ${
              webcamEnabled && audioEnabled 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {webcamEnabled && audioEnabled ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Ready to start</span>
                </>
              ) : (
                <>
                  <Info className="w-4 h-4 mr-2" />
                  <span>Setup required</span>
                </>
              )}
            </div>
            
            <Link
              to={webcamEnabled ? `/interview/${tempId}/start` : '#'}
              onClick={handleStartClick}
              className={`flex items-center justify-center px-5 py-2.5 rounded-full text-white font-medium transition-all ${
                webcamEnabled
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Start Interview
              <div className="bg-white/20 p-1 rounded-full ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section - Camera Preview & Status */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50  border-1 border-gray-400 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Camera Preview */}
            <div className="lg:col-span-2 p-6 mt-4 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                  Camera Preview
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setWebcamEnabled(!webcamEnabled)}
                    variant={webcamEnabled ? 'success' : 'outline'}
                    className="h-9 px-3"
                    size="sm"
                  >
                    <Camera className="w-4 h-4 mr-1.5" />
                    {webcamEnabled ? 'On' : 'Enable'}
                  </Button>
                  
                  <Button 
                    onClick={handleToggleAudio}
                    variant={audioEnabled ? 'success' : 'outline'}
                    className="h-9 px-3"
                    size="sm"
                  >
                    {audioEnabled ? (
                      <Mic className="w-4 h-4 mr-1.5" />
                    ) : (
                      <MicOff className="w-4 h-4 mr-1.5" />
                    )}
                    {audioEnabled ? 'On' : 'Enable'}
                  </Button>
                </div>
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                {webcamEnabled ? (
                  <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    onUserMedia={() => setWebcamEnabled(true)}
                    onUserMediaError={() => {
                      setWebcamEnabled(false);
                      toast.error('Camera error', {
                        description: 'Could not access your camera. Please check permissions.',
                      });
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-700 mb-2">Camera disabled</h4>
                    <p className="text-gray-500 text-sm mb-3">Enable your camera to preview yourself</p>
                    <Button 
                      onClick={handleStartWebcam}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      size="sm"
                    >
                      Enable Camera
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Test your camera and microphone to ensure a smooth interview experience</p>
            </div>

            {/* Interview Details */}
            <div className="p-2">
              <div className="p-4 bg-white/70 backdrop-blur-sm">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Interview Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Position</p>
                  <p className="text-gray-900 font-medium">{interview.role}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Experience</p>
                  <p className="text-gray-900 font-medium">{interview.experience} years</p>
                </div>
              </div>
              
              <div className="flex items-center bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Tech Stack</p>
                  <p className="text-gray-900 font-medium">{interview.description}</p>
                </div>
              </div>
            </div>
          </div>
          </div>
              
              <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-1">Technical Checklist</h3>
             <ul className="space-y-4">
              {[
                { 
                  name: 'Webcam Access', 
                  description: 'Required for video recording',
                  complete: webcamEnabled
                },
                { 
                  name: 'Microphone Access', 
                  description: 'Required for audio recording',
                  complete: audioEnabled
                },
                { 
                  name: 'Stable Connection', 
                  description: 'Minimum 5Mbps recommended',
                  complete: true
                },
                { 
                  name: 'Supported Browser', 
                  description: 'Chrome, Brave, or Edge',
                  complete: true
                }
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    item.complete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {item.complete ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`font-medium ${
                      item.complete ? 'text-gray-900' : 'text-gray-700'
                    }`}>{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Interview Process */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Interview Process
            </h3>
            
            <div className="relative pl-6 border-l border-indigo-200">
              <div className="mb-6 relative">
                <div className="absolute -left-[21px] w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white text-indigo-600">
                  1
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Introduction</h4>
                <p className="text-sm text-gray-600">Brief introduction and overview of the interview process</p>
              </div>
              
              <div className="mb-6 relative">
                <div className="absolute -left-[21px] w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white text-indigo-600">
                  2
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Technical Questions</h4>
                <p className="text-sm text-gray-600">10 questions tailored to the {interview.role} position</p>
              </div>
              
              <div className="mb-6 relative">
                <div className="absolute -left-[21px] w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white text-indigo-600">
                  3
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Response Time</h4>
                <p className="text-sm text-gray-600">Up to 2 minutes to answer each question</p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[21px] w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white text-indigo-600">
                  4
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Feedback</h4>
                <p className="text-sm text-gray-600">Detailed review and feedback after completion</p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Award className="w-5 h-5 mr-2 text-indigo-600" />
              Best Practices
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-indigo-100 rounded p-1 text-indigo-600">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Find a quiet, well-lit environment</p>
                  <p className="text-xs text-gray-500">Your face should be clearly visible on camera</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-indigo-100 rounded p-1 text-indigo-600">
                  <User className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Dress professionally</p>
                  <p className="text-xs text-gray-500">Wear what you would for an in-person interview</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-indigo-100 rounded p-1 text-indigo-600">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Speak clearly and concisely</p>
                  <p className="text-xs text-gray-500">Maintain eye contact with the camera</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-indigo-100 rounded p-1 text-indigo-600">
                  <Info className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Use the STAR method</p>
                  <p className="text-xs text-gray-500">Situation, Task, Action, Result for examples</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-indigo-100 rounded p-1 text-indigo-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Take time to think</p>
                  <p className="text-xs text-gray-500">Pause briefly before answering difficult questions</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <HelpCircle className="w-5 h-5 mr-2 text-indigo-600" />
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Will my interview be recorded?</h4>
                <p className="text-xs text-gray-600">Yes, your responses will be recorded for review and feedback purposes.</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">How long will the interview take?</h4>
                <p className="text-xs text-gray-600">The complete interview typically takes 20-30 minutes.</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Can I skip questions?</h4>
                <p className="text-xs text-gray-600">Yes, but trying to answer all questions is recommended for the best feedback.</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">When will I get my feedback?</h4>
                <p className="text-xs text-gray-600">Immediately after completing all questions.</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Can I retake the interview?</h4>
                <p className="text-xs text-gray-600">Yes, you can take the interview multiple times to practice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPreparationPage;