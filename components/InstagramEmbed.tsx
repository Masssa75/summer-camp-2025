'use client'

import { useEffect, useRef } from 'react'

interface InstagramEmbedProps {
  url: string
  caption?: string
  className?: string
}

export default function InstagramEmbed({ url, caption, className = '' }: InstagramEmbedProps) {
  const embedRef = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    // Load Instagram embed script
    const loadInstagramEmbed = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
    
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      script.defer = true
      script.onload = loadInstagramEmbed
      document.body.appendChild(script)
    } else {
      // If script exists, just process embeds
      loadInstagramEmbed()
    }

    // Process embeds after a delay to ensure DOM is ready
    const timer = setTimeout(loadInstagramEmbed, 1000)

    return () => clearTimeout(timer)
  }, [url])

  // Extract the post ID from the URL
  const getPostId = (url: string) => {
    const match = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)
    return match ? match[2] : null
  }

  const postId = getPostId(url)

  if (!postId) {
    return <div>Invalid Instagram URL</div>
  }

  return (
    <div className={`instagram-embed-container ${className}`}>
      <blockquote
        ref={embedRef}
        className="instagram-media"
        data-instgrm-captioned={true}
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: 'calc(100% - 2px)'
        }}
      />
      {caption && (
        <p className="instagram-caption" style={{ marginTop: '10px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          {caption}
        </p>
      )}
    </div>
  )
}

// Add TypeScript declaration for Instagram embed
declare global {
  interface Window {
    instgrm: {
      Embeds: {
        process: () => void
      }
    }
  }
}