import React, { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing AI Chat Experience...');

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        
        // Update loading text based on progress
        if (newProgress < 30) {
          setLoadingText('Initializing AI Chat Experience...');
        } else if (newProgress < 60) {
          setLoadingText('Loading AI Models...');
        } else if (newProgress < 90) {
          setLoadingText('Setting up Authentication...');
        } else {
          setLoadingText('Almost Ready...');
        }
        
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-10 w-4 h-4 border border-slate-600 rotate-45 animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-20 w-6 h-6 border border-slate-500 rounded-full animate-bounce opacity-20" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-slate-600 rotate-45 animate-ping opacity-25" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute top-60 right-40 w-5 h-5 border border-slate-600 animate-spin opacity-20" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-60 right-10 w-2 h-2 bg-slate-500 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
      </div>

      {/* Main loading content */}
      <div className="text-center relative z-10">
        {/* Logo/Icon */}
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 mx-auto mb-8">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-bold text-white mb-4 font-mono">
          jinshi
        </h1>

        {/* Loading text */}
        <p className="text-slate-400 mb-8 font-mono min-h-[24px]">
          {loadingText}
        </p>

        {/* Loading animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce" style={{ animationDuration: '1.5s' }}></div>
          <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }}></div>
          <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1.5s' }}></div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-slate-800 rounded-full mx-auto mt-8 overflow-hidden border border-slate-700">
          <div 
            className="h-full bg-slate-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Progress percentage */}
        <div className="mt-4 text-slate-500 text-sm font-mono">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-slate-800 rounded-full opacity-5 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-slate-700 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
    </div>
  );
}