'use client'

interface DirectInstagramEmbedProps {
  reelId: string
  className?: string
}

export default function DirectInstagramEmbed({ reelId, className = '' }: DirectInstagramEmbedProps) {
  return (
    <div className={`instagram-direct-embed ${className}`}>
      <style jsx>{`
        .instagram-direct-embed {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .embed-container {
          position: relative;
          width: 100%;
          padding-bottom: 177.78%; /* 9:16 aspect ratio for vertical video */
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .embed-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .video-caption {
          text-align: center;
          margin-top: 15px;
          color: #666;
          font-size: 14px;
          font-style: italic;
        }
      `}</style>
      
      <div className="embed-container">
        <iframe 
          src={`https://www.instagram.com/reel/${reelId}/embed`}
          width="400" 
          height="700" 
          frameBorder="0" 
          scrolling="no" 
          allowTransparency={true}
        />
      </div>
      
      <p className="video-caption">Take a journey through our beautiful campus</p>
    </div>
  )
}