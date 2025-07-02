'use client'

interface SimpleInstagramEmbedProps {
  reelId: string
}

export default function SimpleInstagramEmbed({ reelId }: SimpleInstagramEmbedProps) {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ 
        position: 'relative',
        paddingBottom: '177.78%',
        height: 0,
        background: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <iframe 
          src={`https://www.instagram.com/reel/${reelId}/embed`}
          width="400" 
          height="700" 
          frameBorder="0" 
          scrolling="no" 
          allowTransparency={true}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </div>
      <p style={{
        textAlign: 'center',
        marginTop: '15px',
        color: '#666',
        fontSize: '14px',
        fontStyle: 'italic'
      }}>
        Take a journey through our beautiful campus
      </p>
    </div>
  )
}