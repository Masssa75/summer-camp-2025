'use client'

export default function TestEmbedPage() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>Instagram Embed Test - Live Site</h1>
        
        <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>Test 1: Demo Video (C8Cp5VvvNG6) - Simple iframe</h2>
          <iframe 
            src="https://www.instagram.com/reel/C8Cp5VvvNG6/embed" 
            width="400" 
            height="700" 
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
          />
        </div>

        <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>Test 2: Our Video (DDlZTTih95c) - Simple iframe</h2>
          <iframe 
            src="https://www.instagram.com/reel/DDlZTTih95c/embed" 
            width="400" 
            height="700" 
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
          />
        </div>

        <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>Test 3: Demo Video - With allowFullScreen</h2>
          <iframe 
            src="https://www.instagram.com/reel/C8Cp5VvvNG6/embed" 
            width="400" 
            height="700" 
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
            allowFullScreen={true}
          />
        </div>

        <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>Test 4: Our Video - With allowFullScreen</h2>
          <iframe 
            src="https://www.instagram.com/reel/DDlZTTih95c/embed" 
            width="400" 
            height="700" 
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
            allowFullScreen={true}
          />
        </div>
      </div>
    </div>
  )
}