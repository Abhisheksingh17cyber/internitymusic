import React from 'react';

const DemoBanner = () => {
  const isDemoMode = process.env.NODE_ENV === 'production' && window.location.hostname.includes('github.io');
  
  if (!isDemoMode) return null;
  
  return (
    <div className="bg-gradient-primary text-white py-2 px-4 text-center text-sm">
      <div className="max-w-7xl mx-auto">
        🎵 <strong>Demo Mode:</strong> This is a demonstration version of MusicStream Pro. 
        All functionality is simulated for showcase purposes.
        <a 
          href="https://github.com/Abhisheksingh17cyber/internitymusic" 
          className="ml-2 underline hover:text-gray-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Source Code
        </a>
      </div>
    </div>
  );
};

export default DemoBanner;
