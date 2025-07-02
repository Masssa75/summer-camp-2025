'use client'

import { useState } from 'react'

export default function TestVideoPage() {
  const [embedType, setEmbedType] = useState('iframe')
  const videoUrl = 'https://www.instagram.com/reel/DDlZTTih95c/'
  
  // Extract post ID
  const match = videoUrl.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)
  const postId = match ? match[2] : ''

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Instagram Video Embed Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setEmbedType('iframe')} style={{ marginRight: '10px' }}>
          Iframe Embed
        </button>
        <button onClick={() => setEmbedType('oembed')} style={{ marginRight: '10px' }}>
          oEmbed
        </button>
        <button onClick={() => setEmbedType('direct')}>
          Direct URL
        </button>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Method: {embedType}</h2>
        <p>Post ID: {postId}</p>
        <p>Original URL: {videoUrl}</p>
      </div>

      {embedType === 'iframe' && (
        <div>
          <h3>Iframe Embed (Current Method)</h3>
          <iframe
            src={`https://www.instagram.com/p/${postId}/embed`}
            width="400"
            height="500"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            style={{
              background: 'white',
              border: '1px solid #dbdbdb',
              borderRadius: '3px',
              boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              display: 'block',
              margin: '1px',
              maxWidth: '540px',
              minWidth: '326px',
              padding: '0'
            }}
          />
        </div>
      )}

      {embedType === 'oembed' && (
        <div>
          <h3>oEmbed Method</h3>
          <blockquote 
            className="instagram-media" 
            data-instgrm-captioned 
            data-instgrm-permalink={videoUrl}
            data-instgrm-version="14" 
            style={{
              background:'#FFF',
              border:'0',
              borderRadius:'3px',
              boxShadow:'0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              margin: '1px',
              maxWidth:'540px',
              minWidth:'326px',
              padding:'0',
              width:'calc(100% - 2px)'
            }}>
          </blockquote>
          <script async src="//www.instagram.com/embed.js"></script>
        </div>
      )}

      {embedType === 'direct' && (
        <div>
          <h3>Direct URL in Iframe</h3>
          <iframe
            src={videoUrl}
            width="400"
            height="600"
            frameBorder="0"
            style={{
              border: '1px solid #dbdbdb',
              borderRadius: '3px',
              display: 'block'
            }}
          />
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>Debug Info:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify({
            postId,
            embedUrl: `https://www.instagram.com/p/${postId}/embed`,
            originalUrl: videoUrl,
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'SSR'
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}