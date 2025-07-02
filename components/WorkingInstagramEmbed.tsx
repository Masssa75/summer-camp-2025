'use client'

export default function WorkingInstagramEmbed() {
  return (
    <iframe 
      src="https://www.instagram.com/reel/DDlZTTih95c/embed" 
      width="400" 
      height="700" 
      frameBorder="0" 
      scrolling="no" 
      allowTransparency={true}
      style={{
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        maxWidth: '100%',
        display: 'block',
        margin: '0 auto'
      }}
    />
  )
}