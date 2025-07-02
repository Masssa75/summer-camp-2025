'use client'

import { useEffect, useRef } from 'react'

interface InstagramReelEmbedProps {
  reelUrl: string
  className?: string
}

export default function InstagramReelEmbed({ reelUrl, className = '' }: InstagramReelEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script')
    script.src = '//www.instagram.com/embed.js'
    script.async = true
    
    const loadEmbed = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    }
    
    script.onload = loadEmbed
    document.body.appendChild(script)
    
    // If script is already loaded
    if (window.instgrm) {
      loadEmbed()
    }
    
    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [reelUrl])

  return (
    <div className={`instagram-reel-embed ${className}`} ref={embedRef}>
      <style jsx>{`
        .instagram-reel-embed {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .instagram-wrapper {
          background: #FFF;
          border: 0;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          margin: 1px;
          padding: 0;
          width: 100%;
        }
        
        .video-caption {
          text-align: center;
          margin-top: 15px;
          color: #666;
          font-size: 14px;
          font-style: italic;
        }
      `}</style>
      
      <blockquote 
        className="instagram-media instagram-wrapper" 
        data-instgrm-captioned 
        data-instgrm-permalink={reelUrl}
        data-instgrm-version="14"
      >
        <div style={{ padding: '16px' }}>
          <a 
            href={reelUrl}
            style={{ 
              background: '#FFFFFF',
              lineHeight: 0,
              padding: '0 0',
              textAlign: 'center',
              textDecoration: 'none',
              width: '100%'
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View this post on Instagram
          </a>
        </div>
      </blockquote>
      
      <p className="video-caption">Take a journey through our beautiful campus</p>
    </div>
  )
}