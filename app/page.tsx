import './styles/carousel-brochure.css'
import PhotoCarousel from '@/components/PhotoCarousel'

export default function HomePage() {
  return (
    <main className="brochure-container">
      {/* Slide 1: Title Page */}
      <section className="slide slide-1">
        <div className="background-layer">
          <img src="/references/backgrounds/1.jpg" alt="Phuket coastline" />
        </div>
        <div className="content-wrapper">
          <div className="logo-container">
            <div className="logo-circle">
              <svg viewBox="0 0 100 100" className="logo-icon">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
                <path d="M50 20 C30 35, 30 65, 50 80 C70 65, 70 35, 50 20" fill="currentColor"/>
              </svg>
            </div>
            <span className="logo-text">The Waldorf Phuket</span>
          </div>
          <h1 className="hero-title">
            <span>SUMMER</span>
            <span>CAMP</span>
          </h1>
        </div>
      </section>

      {/* Slide 2: Waldorf-Inspired Summer Camp */}
      <section className="slide slide-2">
        <div className="background-layer">
          <img src="/references/backgrounds/2.jpg" alt="Lagoon with boat" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="header-content">
            <h1>Waldorf-Inspired<br/>Summer Camp:</h1>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/2.jpg', alt: 'Children painting' },
              { src: '/references/Summer Camp Presentation Images/5.jpg', alt: 'Child drawing' },
              { src: '/references/Summer Camp Presentation Images/3.jpg', alt: 'Outdoor shelter' }
            ]}
          />
        </div>
      </section>

      {/* Slide 3: For Our Youngest Explorers */}
      <section className="slide slide-3">
        <div className="background-layer">
          <img src="/references/backgrounds/3.jpg" alt="Forest background" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="text-content">
            <h2>For Our Youngest<br/>Explorers<br/><span className="age-subtitle">(AGES 3-6)</span></h2>
            <div className="highlight-banner">Discover the Magic of Childhood This Summer</div>
            <p>Our Waldorf-inspired Mini Group offers a nurturing haven where childhood blossoms at its own pace.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/3.jpg', alt: 'Children playing in sandbox' }
            ]}
            className="single-photo"
          />
        </div>
      </section>

      {/* Slide 4: A Summer of Wonder */}
      <section className="slide slide-4">
        <div className="background-layer">
          <img src="/references/backgrounds/4.jpg" alt="Green leaves" />
          <div className="background-overlay green-tint"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="wonder-title">A Summer of Wonder,<br/>Just for Them</h2>
            
            <div className="activity-grid">
              <div className="activity-bubble top-left">
                <img src="/references/Summer Camp Presentation Images/5.jpg" alt="Child drawing" />
              </div>
              <div className="activity-bubble top-right">
                <img src="/references/Summer Camp Presentation Images/7.jpg" alt="Child with flour" />
              </div>
              <div className="activity-bubble bottom-left">
                <img src="/references/Summer Camp Presentation Images/1.jpg" alt="Child with crafts" />
              </div>
              <div className="activity-bubble bottom-right">
                <img src="/references/Summer Camp Presentation Images/11.jpg" alt="Outdoor activity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 5: Gentle Rhythms */}
      <section className="slide slide-5">
        <div className="background-layer">
          <img src="/references/backgrounds/5.jpg" alt="Ocean view" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Gentle Rhythms &<br/>Predictable Days:</h2>
            <p>A consistent flow of activities that respects your child's natural need for security and ease.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/5.jpg', alt: 'Children on playground' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 6: Loving Animal Care */}
      <section className="slide slide-6">
        <div className="background-layer">
          <img src="/references/backgrounds/6.jpg" alt="Beach scene" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Loving Animal Care:</h2>
            <p>Gentle interactions and learning to care for our animals, fostering empathy and responsibility.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/15.jpg', alt: 'Children with animals' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 7: Joyful Cooking & Baking */}
      <section className="slide slide-7">
        <div className="background-layer">
          <img src="/references/backgrounds/7.jpg" alt="Limestone cliffs" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Joyful Cooking &<br/>Baking:</h2>
            <p>Simple, hands-on culinary experiences, from kneading dough to preparing wholesome snacks.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/7.jpg', alt: 'Children cooking' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Continue with remaining slides... */}
      {/* I'll add more slides based on the IMAGE_MAPPING.md document */}
      
      {/* Slide 41: Contact */}
      <section className="slide slide-contact">
        <div className="background-layer">
          <img src="/references/backgrounds/41.jpg" alt="Camp facility" />
          <div className="background-overlay dark"></div>
        </div>
        
        <div className="contact-content">
          <h2>CONTACT US</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="icon">📍</span>
              <p>255 Soi Cherngtalay 6, Choeng Thale,<br/>Thalang District, Phuket 83110</p>
            </div>
            <div className="contact-item">
              <span className="icon">📱</span>
              <p>+66 98 912 4218</p>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <p>info@waldorfphuket.com</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}