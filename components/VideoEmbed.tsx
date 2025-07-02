'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

interface VideoEmbedProps {
  instagramUrl: string
  thumbnailUrl?: string
  caption?: string
  className?: string
}

export default function VideoEmbed({ 
  instagramUrl, 
  thumbnailUrl,
  caption, 
  className = '' 
}: VideoEmbedProps) {
  const [showVideo, setShowVideo] = useState(false)
  
  // Extract post ID from Instagram URL
  const match = instagramUrl.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)
  const postId = match ? match[2] : ''
  
  // Default thumbnail if none provided
  const defaultThumbnail = '/references/Summer Camp Presentation Images/campus-thumbnail.jpg'
  const thumbnail = thumbnailUrl || defaultThumbnail

  const handlePlayClick = () => {
    // Open Instagram in new tab since embed has limitations
    window.open(instagramUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`video-embed-container ${className}`}>
      <div className="video-wrapper">
        {!showVideo ? (
          <div className="video-thumbnail" onClick={handlePlayClick}>
            <img 
              src={thumbnail} 
              alt="Campus tour video" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div className="play-overlay">
              <button className="play-button">
                <Play size={40} fill="white" />
              </button>
              <p className="play-text">Watch Campus Tour</p>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.instagram.com/p/${postId}/embed`}
            width="100%"
            height="500"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            style={{
              background: 'white',
              border: 'none',
              overflow: 'hidden'
            }}
          />
        )}
      </div>
      {caption && (
        <p className="video-caption">
          {caption}
        </p>
      )}
      <style jsx>{`
        .video-embed-container {
          width: 100%;
          max-width: 400px;
        }
        
        .video-wrapper {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          background: #000;
        }
        
        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 500px;
          cursor: pointer;
          overflow: hidden;
        }
        
        .video-thumbnail img {
          transition: transform 0.3s ease;
        }
        
        .video-thumbnail:hover img {
          transform: scale(1.05);
        }
        
        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          transition: background 0.3s ease;
        }
        
        .video-thumbnail:hover .play-overlay {
          background: rgba(0, 0, 0, 0.6);
        }
        
        .play-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }
        
        .play-button:hover {
          transform: scale(1.1);
          background: white;
        }
        
        .play-text {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .video-caption {
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}