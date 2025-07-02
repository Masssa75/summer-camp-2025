'use client'

export default function IsolatedInstagramEmbed() {
  return (
    <div 
      style={{
        // Reset all inherited styles
        all: 'initial',
        // Apply only necessary styles
        display: 'block',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        fontFamily: 'inherit'
      }}
    >
      <div
        style={{
          // Create isolation context
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <iframe 
          src="https://www.instagram.com/reel/DDlZTTih95c/embed" 
          width="400" 
          height="700" 
          frameBorder="0" 
          scrolling="no" 
          allowTransparency={true}
          style={{
            border: 'none',
            display: 'block',
            maxWidth: '100%',
            height: 'auto'
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