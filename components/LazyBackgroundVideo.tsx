'use client';

import { useState, useEffect, useRef } from 'react';

interface LazyBackgroundVideoProps {
  src: string;
  mobileSrc?: string;
  poster?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
  threshold?: number; // Intersection observer threshold
}

export default function LazyBackgroundVideo({ 
  src, 
  mobileSrc,
  poster,
  overlay = true,
  overlayOpacity = 0.5,
  className = '',
  children,
  threshold = 0.1
}: LazyBackgroundVideoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine which video source to use based on device
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setVideoSrc(isMobile && mobileSrc ? mobileSrc : src);
  }, [src, mobileSrc]);

  // Lazy load video when it comes into viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Poster image (shows while video loads) */}
      {poster && (
        <img
          src={poster}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Video Background (only renders when visible) */}
      {isVisible && videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
        </video>
      )}

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