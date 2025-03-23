import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useParams } from 'react-router-dom';
import { db } from '../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';
import { Camera, Mic, MicOff, Timer, MessageSquare, ChevronRight, User, Briefcase, Calendar, Award, X } from 'lucide-react';
import Prepare from '../components/Prepare';
const InterviewPage = () => {
  const { tempId } = useParams();
  const [interview, setInterview] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [currentStep, setCurrentStep] = useState('intro');
  const [recording, setRecording] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const webcamRef = useRef(null);

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

  const renderIntroScreen = () => (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
        <User className="w-10 h-10 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Your AI Interview</h1>
      <p className="text-lg text-gray-600 mb-8">Prepare for your upcoming interview with our AI interviewer and get valuable feedback.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="font-medium text-gray-900">Role Description</h3>
          </div>
          <p className="text-gray-600">{interview?.role || 'Not Available'}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Award className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="font-medium text-gray-900">Duration </h3>
          </div>
          <p className="text-gray-600">{'30 minutes '}</p>
        </div>
      </div>

      <Button 
        onClick={() => setCurrentStep('prepare')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg shadow-md transition-all"
      >
        Begin Preparation
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentStep) {
        case("prepare"):
        return <Prepare/>

      default:
        return renderIntroScreen();
    }
  };

  return (
    <div className="min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8">
        {renderCurrentScreen()}
      </main>
    </div>
  );
};

export default InterviewPage;
