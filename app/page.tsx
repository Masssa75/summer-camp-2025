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
            <img src="/references/Logo Only.png" alt="The Waldorf Phuket Logo" className="logo-image" />
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
              { src: '/references/Summer Camp Presentation Images/4.jpg', alt: 'Children playing in sandbox' }
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
                <img src="/references/Summer Camp Presentation Images/6.jpg" alt="Child activity" />
              </div>
              <div className="activity-bubble bottom-left">
                <img src="/references/Summer Camp Presentation Images/7.jpg" alt="Child with crafts" />
              </div>
              <div className="activity-bubble bottom-right">
                <img src="/references/Summer Camp Presentation Images/8.jpg" alt="Outdoor activity" />
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
              { src: '/references/Summer Camp Presentation Images/9.jpg', alt: 'Children on playground' }
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
              { src: '/references/Summer Camp Presentation Images/10.jpg', alt: 'Children with animals' }
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
              { src: '/references/Summer Camp Presentation Images/11.jpg', alt: 'Children cooking' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 8: Imaginative Free Play */}
      <section className="slide slide-8">
        <div className="background-layer">
          <img src="/references/backgrounds/8.jpg" alt="Bamboo forest" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Imaginative Free<br/>Play:</h2>
            <p>Abundant time for creative play in a natural setting, fostering self-direction and social skills.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/12.jpg', alt: 'Children playing' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 9: Storytelling & Puppetry */}
      <section className="slide slide-9">
        <div className="background-layer">
          <img src="/references/backgrounds/9.jpg" alt="Beach scene" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Storytelling &<br/>Puppetry:</h2>
            <p>Enriching tales that ignite the imagination and nurture a love for language.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/13.jpg', alt: 'Story time' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 10: Nature's Classroom */}
      <section className="slide slide-10">
        <div className="background-layer">
          <img src="/references/backgrounds/10.jpg" alt="Beach with palm trees" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Nature's<br/>Classroom:</h2>
            <p>Daily outdoor adventures, exploring the wonders of the natural world through sensory experiences.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/14.jpg', alt: 'Nature exploration' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 11: Handwork & Practical Arts */}
      <section className="slide slide-11">
        <div className="background-layer">
          <img src="/references/backgrounds/11.jpg" alt="Ocean view" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Handwork &<br/>Practical Arts:</h2>
            <p>Simple, joyful activities like sewing, finger knitting, or painting with natural pigments.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/15.jpg', alt: 'Handwork activities' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 12: Nourishing Snacks & Peaceful Moments */}
      <section className="slide slide-12">
        <div className="background-layer">
          <img src="/references/backgrounds/12.jpg" alt="Hillside view" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Nourishing Snacks &<br/>Peaceful Moments:</h2>
            <p>Wholesome, organic snacks and quiet times for rest and reflection.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/16.jpg', alt: 'Snack preparation' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 13: Why Choose The Waldorf Phuket */}
      <section className="slide slide-13">
        <div className="background-layer">
          <img src="/references/backgrounds/13.jpg" alt="Forest landscape" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">Why choose The Waldorf Phuket<br/>Summer Camp for your little ones?</h2>
          </div>
        </div>
      </section>

      {/* Slide 14: Fosters Creativity & Imagination */}
      <section className="slide slide-14">
        <div className="background-layer">
          <img src="/references/backgrounds/14.jpg" alt="Natural playground" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper slide-14-layout">
          <div className="slide-14-photo">
            <img src="/references/Summer Camp Presentation Images/17.jpg" alt="Child with blocks" />
          </div>
          
          <div className="slide-14-text">
            <h2>Fosters Creativity<br/>& Imagination:</h2>
            <p>We believe in nurturing the<br/>inner world of the child.</p>
          </div>
        </div>
      </section>

      {/* Slide 15: Supports Holistic Development */}
      <section className="slide slide-15">
        <div className="background-layer">
          <img src="/references/backgrounds/15.jpg" alt="Waterfall in forest" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Supports Holistic<br/>Development:</h2>
            <p>Focusing on head, heart, and hands.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/18.jpg', alt: 'Children doing art activities' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 16: Connects Children with Nature */}
      <section className="slide slide-16">
        <div className="background-layer">
          <img src="/references/backgrounds/16.jpg" alt="Close-up of seedlings in soil" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Connects children<br/>with Nature:</h2>
            <p>Cultivating a deep appreciation for the environment.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/19.jpg', alt: 'Children watering plants in garden' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 17: Builds Social-Emotional Skills */}
      <section className="slide slide-17">
        <div className="background-layer">
          <img src="/references/backgrounds/17.jpg" alt="Waterfall and ferns" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Builds Social-Emotional<br/>Skills:</h2>
            <p>Through cooperative play and gentle guidance.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/20.jpg', alt: 'Children playing together' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 18: Experienced & Caring Educators */}
      <section className="slide slide-18">
        <div className="background-layer">
          <img src="/references/backgrounds/18.jpg" alt="Tropical beach with trees" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>Experienced & Caring<br/>Educators:</h2>
            <p>Our teachers are dedicated to creating a warm, supportive atmosphere.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/21.jpg', alt: 'Teacher with children in circle' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 19: Summer Camp Schedule */}
      <section className="slide slide-19">
        <div className="background-layer">
          <img src="/references/backgrounds/19.jpg" alt="Nature/greenery" />
          <div className="background-overlay green-tint"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">Summer Camp Schedule</h2>
            <div className="schedule-container">
              <div className="schedule-grid">
                <div className="time-column">
                  <div className="time-slot">8:15 - 9:00</div>
                  <div className="time-slot">9:00 - 10:30</div>
                  <div className="time-slot">10:30 - 11:00</div>
                  <div className="time-slot">11:00 - 12:00</div>
                  <div className="time-slot">12:00 - 1:00</div>
                  <div className="time-slot">1:00 - 2:00</div>
                  <div className="time-slot">2:00 - 3:30</div>
                  <div className="time-slot">3:30 - 4:00</div>
                  <div className="time-slot">4:00 - 4:30</div>
                </div>
                <div className="day-column">
                  <div className="day-header">Monday</div>
                  <div className="activity arrival">Arrival & Free Play</div>
                  <div className="activity handwork">Handwork & Crafts</div>
                  <div className="activity snack">Morning Snack</div>
                  <div className="activity outdoor">Outdoor Play</div>
                  <div className="activity lunch">Lunch</div>
                  <div className="activity rest">Rest Time</div>
                  <div className="activity story">Story & Music</div>
                  <div className="activity snack">Afternoon Snack</div>
                  <div className="activity departure">Departure</div>
                </div>
                <div className="day-column">
                  <div className="day-header">Tuesday</div>
                  <div className="activity arrival">Arrival & Free Play</div>
                  <div className="activity cooking">Cooking & Baking</div>
                  <div className="activity snack">Morning Snack</div>
                  <div className="activity nature">Nature Walk</div>
                  <div className="activity lunch">Lunch</div>
                  <div className="activity rest">Rest Time</div>
                  <div className="activity art">Art & Painting</div>
                  <div className="activity snack">Afternoon Snack</div>
                  <div className="activity departure">Departure</div>
                </div>
                <div className="day-column">
                  <div className="day-header">Wednesday</div>
                  <div className="activity arrival">Arrival & Free Play</div>
                  <div className="activity animals">Animal Care</div>
                  <div className="activity snack">Morning Snack</div>
                  <div className="activity garden">Garden Work</div>
                  <div className="activity lunch">Lunch</div>
                  <div className="activity rest">Rest Time</div>
                  <div className="activity puppet">Puppetry & Drama</div>
                  <div className="activity snack">Afternoon Snack</div>
                  <div className="activity departure">Departure</div>
                </div>
                <div className="day-column">
                  <div className="day-header">Thursday</div>
                  <div className="activity arrival">Arrival & Free Play</div>
                  <div className="activity sensory">Sensory Play</div>
                  <div className="activity snack">Morning Snack</div>
                  <div className="activity outdoor">Outdoor Adventures</div>
                  <div className="activity lunch">Lunch</div>
                  <div className="activity rest">Rest Time</div>
                  <div className="activity movement">Movement & Games</div>
                  <div className="activity snack">Afternoon Snack</div>
                  <div className="activity departure">Departure</div>
                </div>
                <div className="day-column">
                  <div className="day-header">Friday</div>
                  <div className="activity arrival">Arrival & Free Play</div>
                  <div className="activity celebration">Weekly Celebration</div>
                  <div className="activity snack">Morning Snack</div>
                  <div className="activity free">Free Choice Activities</div>
                  <div className="activity lunch">Lunch</div>
                  <div className="activity rest">Rest Time</div>
                  <div className="activity review">Week Review & Sharing</div>
                  <div className="activity snack">Afternoon Snack</div>
                  <div className="activity departure">Departure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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