'use client'

import PhotoCarousel from '@/components/PhotoCarousel'

interface PageContentProps {
  ageGroup: 'mini' | 'explorer'
}

export default function PageContent({ ageGroup }: PageContentProps) {
  if (ageGroup === 'mini') {
    return (
      <>
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
        <section className="slide slide-3" id="mini-section">
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

        {/* Include all Mini-related slides (4-19) */}
        {/* ... Mini content slides ... */}

        {/* Mini Schedule */}
        <section className="slide slide-19" id="schedule-section">
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
                  {/* Add other days */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // Explorer content
  return (
    <>
      {/* Slide 20: For Our Growing Adventurers */}
      <section className="slide slide-20" id="explorer-section">
        <div className="background-layer">
          <img src="/references/backgrounds/20.jpg" alt="Dense forest canopy" />
          <div className="background-overlay green-tint"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <div className="age-circle">
              <h2>For Our Growing<br/>Adventurers:</h2>
              <p className="age-subtitle-large">The Explorers (Ages 7-13)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Include all Explorer-related slides (21-39) */}
      {/* ... Explorer content slides ... */}

      {/* Explorer Schedule */}
      <section className="slide slide-39" id="explorer-schedule-section">
        <div className="background-layer">
          <img src="/references/backgrounds/39.jpg" alt="Grass field" />
          <div className="background-overlay green-tint"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">Summer Camp Schedule - Explorers (Ages 7-13)</h2>
            <div className="schedule-container">
              <div className="schedule-grid">
                <div className="time-column">
                  <div className="time-slot">8:45 - 9:15</div>
                  <div className="time-slot">9:15 - 11:00</div>
                  <div className="time-slot">11:00 - 11:30</div>
                  <div className="time-slot">11:30 - 12:30</div>
                  <div className="time-slot">12:30 - 1:30</div>
                  <div className="time-slot">1:30 - 3:00</div>
                  <div className="time-slot">3:00 - 3:30</div>
                  <div className="time-slot">3:30 - 4:30</div>
                  <div className="time-slot">4:30 - 5:00</div>
                </div>
                <div className="day-column">
                  <div className="day-header">Monday</div>
                  <div className="activity arrival">Morning Circle</div>
                  <div className="activity cooking">Thai Cooking</div>
                  <div className="activity snack">Morning Break</div>
                  <div className="activity outdoor">Beach Adventures</div>
                  <div className="activity lunch">Lunch</div>
                  <div className="activity handwork">Bushcraft Skills</div>
                  <div className="activity snack">Afternoon Break</div>
                  <div className="activity art">Art & Reflection</div>
                  <div className="activity departure">Departure</div>
                </div>
                {/* Add other days */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}