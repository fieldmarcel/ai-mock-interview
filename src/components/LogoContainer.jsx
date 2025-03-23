import React from 'react';
import {  Target, Circle } from 'lucide-react';

const LogoContainer = () => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center justify-center h-10 w-10">
        {/* Logo mark */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md"></div>
        <div className="absolute inset-1 bg-white rounded-md"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Circle className="h-6 w-6 text-indigo-500 absolute" strokeWidth={1.5} />
          <Target className="h-5 w-5 text-indigo-600" strokeWidth={2} />
        </div>
      </div>
      
      {/* Logo text */}
      <div className="ml-2 flex flex-col">
        <span className="logofont text-xl font-bold text-gray-800 leading-none">IntervueX </span>
        <span className="text-[0.6rem] text-indigo-600 font-medium">AI Interview Coach</span>
      </div>
    </div>
  );
};

export default LogoContainer;
