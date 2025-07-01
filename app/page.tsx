import './styles/brochure.css'

export default function HomePage() {
  return (
    <main className="brochure-container">
      {/* Slide 1: Title Page */}
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
        <div className="content-grid">
          <div className="content-left">
            <div className="image-main">
              <img src="/images/presentation/2.jpg" alt="Phuket scenery" />
            </div>
            <h2 className="section-title white-text">
              Waldorf-Inspired<br />
              Summer Camp:
            </h2>
          </div>
          <div className="content-right">
            <div className="image-grid">
              <div className="image-box">
                <img src="/images/presentation/7.jpg" alt="Children activities" />
              </div>
              <div className="image-box">
                <img src="/images/presentation/8.jpg" alt="Outdoor play" />
              </div>
              <div className="image-box large">
                <img src="/images/presentation/9.jpg" alt="Nature exploration" />
              </div>
            </div>
            <div className="curved-shape white-curve"></div>
          </div>
        </div>
      </section>

      {/* Slide 3: For Our Youngest Explorers */}
      <section className="slide slide-3">
        <div className="content-wrapper">
          <div className="text-content">
            <h2 className="section-title white-text">
              For Our Youngest<br />
              Explorers<br />
              <span className="subtitle">(AGES 3-6)</span>
            </h2>
            <div className="highlight-box">
              <p>Discover the Magic of Childhood This Summer</p>
            </div>
            <p className="body-text">
              Our Waldorf-inspired Mini Group offers<br />
              a nurturing haven where childhood<br />
              blossoms at its own pace.
            </p>
          </div>
          <div className="image-content">
            <div className="rounded-image-large">
              <img src="/images/presentation/3.jpg" alt="Children playing in sand" />
            </div>
          </div>
          <div className="curved-shape bottom-curve"></div>
        </div>
      </section>

      {/* Slide 4: Why Our Mini Group is Special */}
      <section className="slide slide-4">
        <div className="special-content">
          <h2 className="section-title green-text center">
            Why Our Mini Group is Special:
          </h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Gentle Rhythms & Predictable Days:</h3>
              <p>A consistent flow of activities that respects your child's natural need for security and ease.</p>
            </div>
            <div className="feature-item">
              <h3>Animal Care & Connection:</h3>
              <p>Daily interactions with our gentle farm animals, fostering empathy and responsibility.</p>
            </div>
            <div className="feature-item">
              <h3>Creative Play & Arts:</h3>
              <p>Hands-on activities including painting, crafts, and imaginative play in our prepared environments.</p>
            </div>
            <div className="feature-item">
              <h3>Nature Exploration:</h3>
              <p>Safe outdoor adventures exploring the wonders of our tropical surroundings.</p>
            </div>
            <div className="feature-item highlight">
              <h3>Supports Holistic Development:</h3>
              <p>Focusing on head, heart, and hands—developing thinking, feeling, and willing in harmony.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 5: Gentle Rhythms */}
      <section className="slide slide-5" style={{backgroundImage: 'url(/images/backgrounds/1.jpg)'}}>
        <div className="overlay-content">
          <div className="text-box-green">
            <h2 className="box-title">Gentle Rhythms &<br />Predictable Days:</h2>
            <p className="box-text">
              A consistent flow of<br />
              activities that respects<br />
              your child's natural need<br />
              for security and ease.
            </p>
          </div>
          <div className="activity-image">
            <img src="/images/presentation/5.jpg" alt="Children activities" />
          </div>
        </div>
      </section>

      {/* Slide 6-9: Activity Features */}
      {[
        {
          title: "Animal Care & Connection:",
          desc: "Daily interactions with our gentle farm animals, fostering empathy and responsibility.",
          img: "6"
        },
        {
          title: "Creative Play & Arts:",
          desc: "Hands-on activities including painting, crafts, and imaginative play in our prepared environments.",
          img: "7"
        },
        {
          title: "Nature Exploration:",
          desc: "Safe outdoor adventures exploring the wonders of our tropical surroundings.",
          img: "8"
        }
      ].map((item, idx) => (
        <section key={idx} className="slide slide-activity" style={{backgroundImage: `url(/images/presentation/${item.img}.jpg)`}}>
          <div className="activity-overlay">
            <div className="activity-text-box">
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
            </div>
          </div>
        </section>
      ))}

      {/* Slide 10: Nature's Classroom */}
      <section className="slide slide-10">
        <div className="nature-classroom">
          <div className="nc-left">
            <img src="/images/backgrounds/10.jpg" alt="Beach scene" />
          </div>
          <div className="nc-right">
            <div className="nc-text-box">
              <h2>Nature's<br />Classroom:</h2>
              <p>
                Daily outdoor adventures,<br />
                exploring the wonders of<br />
                the natural world through<br />
                sensory experiences.
              </p>
            </div>
            <div className="nc-image">
              <img src="/images/presentation/10.jpg" alt="Nature activities" />
            </div>
          </div>
        </div>
      </section>

      {/* Slide 11-14: Daily Rhythm */}
      <section className="slide slide-schedule">
        <div className="schedule-content">
          <h2 className="schedule-title">A Day in Mini Group</h2>
          <div className="schedule-grid">
            <div className="time-slot">
              <div className="time">8:00 - 8:30</div>
              <div className="activity">Welcome & Free Play</div>
            </div>
            <div className="time-slot">
              <div className="time">8:30 - 9:00</div>
              <div className="activity">Morning Circle</div>
            </div>
            <div className="time-slot">
              <div className="time">9:00 - 10:00</div>
              <div className="activity">Main Activity</div>
            </div>
            <div className="time-slot">
              <div className="time">10:00 - 10:30</div>
              <div className="activity">Snack Time</div>
            </div>
            <div className="time-slot">
              <div className="time">10:30 - 11:30</div>
              <div className="activity">Outdoor Exploration</div>
            </div>
            <div className="time-slot">
              <div className="time">11:30 - 12:30</div>
              <div className="activity">Lunch & Rest</div>
            </div>
            <div className="time-slot">
              <div className="time">12:30 - 1:30</div>
              <div className="activity">Quiet Activities</div>
            </div>
            <div className="time-slot">
              <div className="time">1:30 - 2:00</div>
              <div className="activity">Closing Circle & Pickup</div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 20: For Our Growing Adventurers */}
      <section className="slide slide-20">
        <div className="adventurers-content">
          <div className="adv-left">
            <h2 className="adv-title">
              For Our<br />
              Growing<br />
              Adventurers:
            </h2>
            <h3 className="adv-subtitle">
              The Explorers<br />
              (Ages 7-13)
            </h3>
          </div>
          <div className="adv-right">
            <img src="/images/backgrounds/20.jpg" alt="Forest scene" />
          </div>
        </div>
      </section>

      {/* Slide 21-29: Explorer Activities */}
      <section className="slide slide-explorers">
        <div className="explorers-grid">
          <h2 className="explorers-title">Our Explorers Program Includes:</h2>
          <div className="explorer-features">
            <div className="explorer-item">
              <h3>Thai Cooking Classes</h3>
              <p>Master authentic Thai cuisine with hands-on cooking experiences</p>
            </div>
            <div className="explorer-item">
              <h3>Introduction to Muay Thai</h3>
              <p>Learn discipline and self-defense through Thailand's national sport</p>
            </div>
            <div className="explorer-item">
              <h3>Beach & Water Activities</h3>
              <p>Swimming, snorkeling, and marine ecosystem exploration</p>
            </div>
            <div className="explorer-item">
              <h3>Bushcraft & Survival Skills</h3>
              <p>Essential outdoor skills and nature connection</p>
            </div>
            <div className="explorer-item">
              <h3>Arts & Traditional Crafts</h3>
              <p>Express creativity through various artistic mediums</p>
            </div>
            <div className="explorer-item">
              <h3>Cultural Excursions</h3>
              <p>Temple visits, local markets, and Thai cultural immersion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 40: Every Summer Quote */}
      <section className="slide slide-40" style={{backgroundImage: 'url(/images/presentation/40.jpg)'}}>
        <div className="quote-overlay">
          <h2 className="quote-text">
            EVERY SUMMER, A THOUSAND<br />
            MEMORIES ARE WAITING TO BE<br />
            MADE
          </h2>
        </div>
      </section>

      {/* Slide 41: Contact */}
      <section className="slide slide-contact">
        <div className="contact-content">
          <div className="contact-left">
            <img src="/images/presentation/41.jpg" alt="Camp entrance" />
          </div>
          <div className="contact-right">
            <h2 className="contact-title">CONTACT US</h2>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>ADDRESS</h4>
                  <p>255 Soi Cherngtalay 6, Choeng<br />
                  Thale, Thalang District, Phuket 83110</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <h4>WHATSAPP</h4>
                  <p>+66 98 912 4218</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>EMAIL</h4>
                  <p>info@waldorfphuket.com</p>
                </div>
              </div>
            </div>
            <div className="qr-code">
              <img src="/images/presentation/41.jpg" alt="QR Code" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}