'use client'

import { useEffect, useRef } from 'react'

interface InstagramEmbedProps {
  url: string
  caption?: string
  className?: string
}

export default function InstagramEmbed({ url, caption, className = '' }: InstagramEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Instagram embed script
    if (window.instgrm) {
      window.instgrm.Embeds.process()
    } else {
      const script = document.createElement('script')
      script.src = '//www.instagram.com/embed.js'
      script.async = true
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process()
        }
      }
      document.body.appendChild(script)
    }
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
        data-instgrm-captioned
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
      >
        <div style={{ padding: '16px' }}>
          <a
            href={url}
            style={{
              background: '#FFFFFF',
              lineHeight: '0',
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