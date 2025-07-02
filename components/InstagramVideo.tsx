'use client'

import { useState, useEffect } from 'react'

interface InstagramVideoProps {
  url: string
  caption?: string
  className?: string
  width?: number
  height?: number
}

export default function InstagramVideo({ 
  url, 
  caption, 
  className = '', 
  width = 400,
  height = 500 
}: InstagramVideoProps) {
  const [embedUrl, setEmbedUrl] = useState('')

  useEffect(() => {
    // Convert Instagram URL to embed URL
    const match = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)
    if (match) {
      const postId = match[2]
      setEmbedUrl(`https://www.instagram.com/p/${postId}/embed`)
    }
  }, [url])

  if (!embedUrl) {
    return <div>Loading video...</div>
  }

  return (
    <div className={`instagram-video-container ${className}`}>
      <div className="video-wrapper" style={{ 
        width: '100%', 
        maxWidth: `${width}px`,
        margin: '0 auto'
      }}>
        <iframe
          src={embedUrl}
          width="100%"
          height={height}
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          style={{
            background: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
          title="Instagram Video"
        />
      </div>
      {caption && (
        <p style={{ 
          marginTop: '15px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          {caption}
        </p>
      )}
    </div>
  )
}