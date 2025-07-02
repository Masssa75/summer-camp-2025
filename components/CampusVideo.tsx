'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface CampusVideoProps {
  className?: string
}

export default function CampusVideo({ className = '' }: CampusVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted for autoplay
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className={`video-container ${className}`}>
      <style jsx>{`
        .video-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .video-wrapper {
          position: relative;
          padding-bottom: 177.78%; /* 16:9 aspect ratio */
          height: 0;
        }

        video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 20px 15px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video-container:hover .video-controls {
          opacity: 1;
        }

        .control-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .play-overlay:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: white;
        }

        .play-overlay svg {
          width: 40px;
          height: 40px;
          color: #7a9a3b;
          margin-left: 5px;
        }

        .video-caption {
          text-align: center;
          margin-top: 15px;
          color: #666;
          font-size: 14px;
          font-style: italic;
        }
      `}</style>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          poster="/references/Summer Camp Presentation Images/campus-thumbnail.jpg"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/videos/campus-tour.mp4" type="video/mp4" />
          <source src="/videos/campus-tour.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <div className="play-overlay" onClick={togglePlay}>
            <Play fill="currentColor" />
          </div>
        )}

        <div className="video-controls">
          <button className="control-button" onClick={togglePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="white" />}
          </button>
          <button className="control-button" onClick={toggleMute}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      <p className="video-caption">Take a journey through our beautiful campus</p>
    </div>
  )
}