'use client';

import { useState, useEffect } from 'react';

interface BackgroundVideoProps {
  src: string;
  poster?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function BackgroundVideo({ 
  src, 
  poster,
  overlay = true,
  overlayOpacity = 0.5,
  className = '',
  children
}: BackgroundVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
      </video>

      {/* Optional Dark Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}