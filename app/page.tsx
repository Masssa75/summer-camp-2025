import './styles/brochure.css'

export default function HomePage() {
  return (
    <main className="brochure-container">
      {/* Slide 1: Title Page - Using clean background */}
      <section className="slide slide-1">
        <div className="hero-background">
          <img src="/images/backgrounds/1.jpg" alt="Phuket coastline" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
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
            <span className="hero-title-line">SUMMER</span>
            <span className="hero-title-line">CAMP</span>
          </h1>
        </div>
      </section>

      {/* Slide 2: Waldorf-Inspired Summer Camp */}
      <section className="slide slide-2">
        <div className="slide-content">
          <div className="left-section">
            <div className="main-image-container">
              <img src="/images/backgrounds/2.jpg" alt="Phuket lagoon" className="main-bg" />
            </div>
            <h2 className="overlay-title">
              Waldorf-Inspired<br />
              Summer Camp:
            </h2>
          </div>
          <div className="right-section">
            <div className="image-collage">
              <div className="collage-item rounded-1">
                <img src="/images/presentation/2.jpg" alt="Children at table" />
              </div>
              <div className="collage-item rounded-2">
                <img src="/images/presentation/2.jpg" alt="Children activities" />
              </div>
              <div className="collage-item rounded-3">
                <img src="/images/presentation/2.jpg" alt="Outdoor play" />
              </div>
            </div>
            <div className="green-circle"></div>
          </div>
        </div>
      </section>

      {/* Slide 3: For Our Youngest Explorers */}
      <section className="slide slide-3">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/20.jpg" alt="Forest background" />
        </div>
        <div className="slide-content-overlay">
          <div className="text-section">
            <h2 className="section-title-white">
              For Our Youngest<br />
              Explorers<br />
              <span className="age-subtitle">(AGES 3-6)</span>
            </h2>
            <div className="highlight-pill">
              Discover the Magic of Childhood This Summer
            </div>
            <p className="body-text-white">
              Our Waldorf-inspired Mini Group offers<br />
              a nurturing haven where childhood<br />
              blossoms at its own pace.
            </p>
          </div>
          <div className="image-section">
            <div className="rounded-photo-frame">
              <img src="/images/presentation/3.jpg" alt="Children playing" />
            </div>
          </div>
          <div className="green-curve-bottom"></div>
        </div>
      </section>

      {/* Slide 4: Why Our Mini Group is Special */}
      <section className="slide slide-4">
        <div className="features-container">
          <h2 className="features-title">Why Our Mini Group is Special:</h2>
          <div className="features-layout">
            <div className="features-column">
              <div className="feature-box">
                <h3>Gentle Rhythms &<br />Predictable Days:</h3>
                <p>A consistent flow of activities that respects your child's natural need for security and ease.</p>
              </div>
              <div className="feature-box">
                <h3>Animal Care &<br />Connection:</h3>
                <p>Daily interactions with our gentle farm animals, fostering empathy and responsibility.</p>
              </div>
            </div>
            <div className="features-column">
              <div className="feature-box">
                <h3>Creative Play & Arts:</h3>
                <p>Hands-on activities including painting, crafts, and imaginative play in our prepared environments.</p>
              </div>
              <div className="feature-box">
                <h3>Nature Exploration:</h3>
                <p>Safe outdoor adventures exploring the wonders of our tropical surroundings.</p>
              </div>
            </div>
          </div>
          <div className="feature-box-wide">
            <h3>Supports Holistic Development:</h3>
            <p>Focusing on head, heart, and hands—developing thinking, feeling, and willing in harmony.</p>
          </div>
        </div>
      </section>

      {/* Slide 5: Gentle Rhythms & Predictable Days */}
      <section className="slide slide-5">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/1.jpg" alt="Ocean view" />
        </div>
        <div className="slide-content-overlay">
          <div className="green-text-box">
            <h2>Gentle Rhythms &<br />Predictable Days:</h2>
            <p>A consistent flow of<br />
            activities that respects<br />
            your child's natural need<br />
            for security and ease.</p>
          </div>
          <div className="activity-photo">
            <img src="/images/presentation/5.jpg" alt="Children playing" />
          </div>
        </div>
      </section>

      {/* Slide 6: Animal Care & Connection */}
      <section className="slide slide-6">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/1.jpg" alt="Nature background" />
        </div>
        <div className="slide-content-overlay">
          <div className="green-text-box">
            <h2>Animal Care &<br />Connection:</h2>
            <p>Daily interactions with<br />
            our gentle farm animals,<br />
            fostering empathy and<br />
            responsibility.</p>
          </div>
          <div className="activity-photo">
            <img src="/images/presentation/6.jpg" alt="Animal care" />
          </div>
        </div>
      </section>

      {/* Slide 7: Joyful Cooking & Baking */}
      <section className="slide slide-7">
        <div className="slide-bg-split">
          <div className="split-left">
            <img src="/images/backgrounds/2.jpg" alt="Ocean view" />
          </div>
          <div className="split-right">
            <img src="/images/backgrounds/1.jpg" alt="Mountain view" />
          </div>
        </div>
        <div className="slide-content-overlay">
          <div className="green-text-box">
            <h2>Joyful Cooking &<br />Baking:</h2>
            <p>Simple, hands-on culinary<br />
            experiences, from<br />
            kneading dough to<br />
            preparing wholesome<br />
            snacks.</p>
          </div>
          <div className="activity-photo-rounded">
            <img src="/images/presentation/7.jpg" alt="Cooking activities" />
          </div>
        </div>
      </section>

      {/* Slide 8: Creative Play & Arts */}
      <section className="slide slide-8">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/1.jpg" alt="Beach background" />
        </div>
        <div className="slide-content-overlay">
          <div className="green-text-box">
            <h2>Creative Play & Arts:</h2>
            <p>Hands-on activities including<br />
            painting, crafts, and<br />
            imaginative play in our<br />
            prepared environments.</p>
          </div>
          <div className="activity-photo">
            <img src="/images/presentation/8.jpg" alt="Arts and crafts" />
          </div>
        </div>
      </section>

      {/* Slide 9: Storytelling & Puppetry */}
      <section className="slide slide-9">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/1.jpg" alt="Ocean background" />
        </div>
        <div className="slide-content-overlay">
          <div className="green-text-box">
            <h2>Storytelling &<br />Puppetry:</h2>
            <p>Enriching tales that ignite<br />
            the imagination and<br />
            nurture a love for<br />
            language.</p>
          </div>
          <div className="activity-photo-rounded">
            <img src="/images/presentation/9.jpg" alt="Storytelling activities" />
          </div>
        </div>
      </section>

      {/* Slide 10: Nature's Classroom */}
      <section className="slide slide-10">
        <div className="nature-split">
          <div className="nature-left">
            <img src="/images/backgrounds/10.jpg" alt="Beach scene" />
          </div>
          <div className="nature-right">
            <div className="nature-text-box">
              <h2>Nature's<br />Classroom:</h2>
              <p>Daily outdoor adventures,<br />
              exploring the wonders of<br />
              the natural world through<br />
              sensory experiences.</p>
            </div>
            <div className="nature-photo">
              <img src="/images/presentation/10.jpg" alt="Nature exploration" />
            </div>
          </div>
        </div>
      </section>

      {/* Slide 11: Handwork & Practical Arts */}
      <section className="slide slide-11">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/1.jpg" alt="Ocean view" />
        </div>
        <div className="slide-content-overlay">
          <div className="green-text-box">
            <h2>Handwork &<br />Practical Arts:</h2>
            <p>Simple, joyful activities like<br />
            sewing, finger knitting, or<br />
            painting with natural<br />
            pigments.</p>
          </div>
          <div className="activity-photo">
            <img src="/images/presentation/11.jpg" alt="Handwork activities" />
          </div>
        </div>
      </section>

      {/* Slide 12: Nourishing Snacks & Peaceful Moments */}
      <section className="slide slide-12">
        <div className="slide-bg-split">
          <div className="split-left">
            <img src="/images/backgrounds/4.jpg" alt="Beach view" />
          </div>
          <div className="split-right">
            <img src="/images/backgrounds/12.jpg" alt="Hills view" />
          </div>
        </div>
        <div className="slide-content-overlay">
          <div className="green-text-box">
            <h2>Nourishing Snacks &<br />Peaceful Moments:</h2>
            <p>Wholesome, organic<br />
            snacks and quiet times for<br />
            rest and reflection.</p>
          </div>
          <div className="activity-photo-rounded">
            <img src="/images/presentation/12.jpg" alt="Snack time" />
          </div>
        </div>
      </section>
      
      {/* Slide 13: Why Choose The Waldorf Phuket */}
      <section className="slide slide-13">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/13.jpg" alt="Forest landscape" />
        </div>
        <div className="slide-content-overlay">
          <div className="why-choose-content">
            <h2 className="white-title-centered">Why choose The Waldorf Phuket<br />Summer Camp for your little ones?</h2>
          </div>
        </div>
      </section>

      {/* Slide 14: Fosters Creativity & Imagination */}
      <section className="slide slide-14">
        <div className="fosters-layout">
          <div className="fosters-left">
            <div className="fosters-photo">
              <img src="/images/presentation/14.jpg" alt="Child playing with blocks" />
            </div>
          </div>
          <div className="fosters-right">
            <img src="/images/backgrounds/14.jpg" alt="School building" className="fosters-bg" />
            <div className="fosters-text">
              <h2 className="fosters-title">Fosters Creativity<br />& Imagination:</h2>
              <p className="fosters-subtitle">We believe in nurturing the<br />inner world of the child.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Slide 20: For Our Growing Adventurers */}
      <section className="slide slide-20">
        <div className="adventurers-layout">
          <div className="adventurers-text">
            <h2 className="adventurers-title">
              For Our<br />
              Growing<br />
              Adventurers:
            </h2>
            <h3 className="adventurers-subtitle">
              The Explorers<br />
              (Ages 7-13)
            </h3>
          </div>
          <div className="adventurers-bg">
            <img src="/images/backgrounds/20.jpg" alt="Forest scene" />
          </div>
          <div className="white-circle-large"></div>
        </div>
      </section>

      {/* Slide 21: Unplug, Explore, Create */}
      <section className="slide slide-21">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/21.jpg" alt="Island paradise" />
        </div>
        <div className="slide-content-overlay">
          <div className="explorers-intro">
            <h2 className="white-title-centered">Unplug, Explore, Create: Your Waldorf Summer<br />Adventure</h2>
            <p className="white-text-centered">
              Are you ready for a summer of meaningful challenges, cultural immersion, artistic<br />
              expression, and real-world connection? Our Waldorf-inspired summer Camp Group<br />
              offers a vibrant alternative to screen time, focusing on practical skills, creative<br />
              endeavors, and a deep connection to the natural world and local culture.
            </p>
          </div>
        </div>
      </section>

      {/* Slide 22: Beach Day Adventures */}
      <section className="slide slide-22">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/1.jpg" alt="Beach background" />
        </div>
        <div className="slide-content-overlay">
          <div className="beach-day-content">
            <h2 className="section-title-white">IGNITE THEIR POTENTIAL THIS SUMMER:</h2>
            <div className="beach-split">
              <div className="beach-photo">
                <img src="/images/presentation/22.jpg" alt="Beach activities" />
              </div>
              <div className="beach-text">
                <h3 className="beach-subtitle">BEACH DAY ADVENTURES:</h3>
                <p className="white-text-lg">
                  Explore the wonders of the<br />
                  coast with nature walks,<br />
                  swimming in the clear water<br />
                  and fun beach games.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 23: Exciting Field Trips */}
      <section className="slide slide-23">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/23.jpg" alt="Forest waterfall" />
        </div>
        <div className="slide-content-overlay">
          <div className="field-trips-content">
            <div className="field-photo">
              <img src="/images/presentation/23.jpg" alt="Field trip activities" />
            </div>
            <div className="field-text">
              <h2 className="green-title-large">EXCITING FIELD TRIPS:</h2>
              <p className="white-text-lg">
                Discover local wonders and<br />
                expand horizons with<br />
                engaging excursions (e.g.,<br />
                local nature parks,<br />
                traditional craft centers).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 24: Authentic Thai Cooking */}
      <section className="slide slide-24">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/24.jpg" alt="Beach and islands" />
        </div>
        <div className="slide-content-overlay">
          <div className="cooking-content">
            <div className="cooking-photo">
              <img src="/images/presentation/24.jpg" alt="Thai cooking class" />
            </div>
            <div className="cooking-text">
              <h2 className="white-title">AUTHENTIC THAI<br />COOKING:</h2>
              <p className="white-text-lg">
                Hands-on culinary<br />
                experiences, learning to<br />
                prepare delicious and<br />
                traditional Thai dishes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 25: Muay Thai */}
      <section className="slide slide-25">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/25.jpg" alt="Thai temple background" />
        </div>
        <div className="slide-content-overlay">
          <div className="muay-thai-content">
            <div className="photo-frame-left">
              <img src="/images/presentation/25.jpg" alt="Muay Thai training" />
            </div>
            <div className="text-section-right">
              <h2 className="white-title">INTRODUCTION TO<br />MUAY THAI:</h2>
              <p className="white-text-lg">
                Experience the discipline<br />
                and cultural heritage of<br />
                Thailand's national sport<br />
                through engaging, age-<br />
                appropriate sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 34: Cultivate Creativity & Innovation */}
      <section className="slide slide-34">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/1.jpg" alt="Beach view" />
        </div>
        <div className="slide-content-overlay">
          <div className="cultivate-content">
            <div className="cultivate-text">
              <h2 className="green-title-large">CULTIVATE CREATIVITY<br />& INNOVATION:</h2>
              <p className="white-text-lg">
                Moving beyond templates to<br />
                original thought and<br />
                expression.
              </p>
            </div>
            <div className="cultivate-photo">
              <img src="/images/presentation/34.jpg" alt="Creative activities" />
            </div>
          </div>
        </div>
      </section>

      {/* Slide 36: Strengthen Social Bonds */}
      <section className="slide slide-36">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/36.jpg" alt="Coastal view" />
        </div>
        <div className="slide-content-overlay">
          <div className="social-bonds-content">
            <div className="social-text">
              <h2 className="white-title">STRENGTHEN<br />SOCIAL BONDS:</h2>
              <p className="white-text-lg">
                Through collaborative<br />
                projects and shared<br />
                adventures.
              </p>
            </div>
            <div className="social-photo">
              <img src="/images/presentation/36.jpg" alt="Children collaborating" />
            </div>
          </div>
        </div>
      </section>

      {/* Slide 40: Every Summer Quote */}
      <section className="slide slide-40">
        <div className="slide-bg-image">
          <img src="/images/backgrounds/40.jpg" alt="Big Buddha Phuket" />
        </div>
        <div className="quote-overlay-dark">
          <h2 className="quote-text">
            EVERY SUMMER, A THOUSAND<br />
            MEMORIES ARE WAITING TO BE<br />
            MADE
          </h2>
        </div>
      </section>

      {/* Slide 41: Contact */}
      <section className="slide slide-contact">
        <div className="contact-layout">
          <div className="contact-image">
            <img src="/images/presentation/41.jpg" alt="Camp location" />
          </div>
          <div className="contact-info-section">
            <h2 className="contact-title">CONTACT US</h2>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon orange">📍</span>
                <div>
                  <h4>ADDRESS</h4>
                  <p>255 Soi Cherngtalay 6, Choeng<br />
                  Thale, Thalang District, Phuket 83110</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon orange">📱</span>
                <div>
                  <h4>WHATSAPP</h4>
                  <p>+66 98 912 4218</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon orange">✉️</span>
                <div>
                  <h4>EMAIL</h4>
                  <p>info@waldorfphuket.com</p>
                </div>
              </div>
            </div>
            <div className="qr-section">
              <img src="/images/presentation/41.jpg" alt="QR Code" className="qr-code" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}