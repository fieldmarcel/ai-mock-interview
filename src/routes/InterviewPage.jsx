import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useParams } from 'react-router-dom';
import { db } from '../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LucideWebcam } from 'lucide-react';

const InterviewPage = () => {
    const { tempId } = useParams();
    const [interview, setInterview] = useState([]);
    const [webcamEnabled, setWebcamEnabled] = useState(false);

    const getData = async () => {
        const docRef = doc(db, 'ai-mock-interviewer', tempId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log('Document data:', docSnap.data());
            setInterview(docSnap.data());
            toast.success('Interview data loaded successfully!');
        } else {
            console.log('No such document!');
            toast.error('Interview not found.');
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen   p-6">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-4">
                AI Mock Interview
            </motion.h1>
            <p className="text-gray-600 mb-8">Prepare for your next interview with AI-driven mock sessions.</p>
            <div className="w-full max-w-md p-4 bg-gray-800 rounded-xl shadow-md">
                {webcamEnabled ? (
                    <Webcam
                        className="w-full h-64 rounded-md shadow-lg"
                        onUserMedia={() => setWebcamEnabled(true)}
                        onUserMediaError={() => setWebcamEnabled(false)}
                        mirrored={true}
                    />
                ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-200 rounded-md">
                        <LucideWebcam size={48} className="text-gray-500" />
                    </div>
                )}
                <Button onClick={() => setWebcamEnabled(!webcamEnabled)} className="mt-4 w-full text-white">
                    {webcamEnabled ? 'Disable Webcam' : 'Enable Webcam'}
                </Button>
            </div>

<div  className='flex flex-col my-5'></div>

        </div>
    );
};

export default InterviewPage;
