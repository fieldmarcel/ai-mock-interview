import React from 'react';

const LogoContainer = () => {
  return (
    <div className="flex items-center">
      <img
        src="null" 
        alt="Logo"
        className="h-10 w-auto"
      />
      <span className="ml-2 text-xl font-bold text-gray-800">MyApp</span>
    </div>
  );
};

export default LogoContainer;