'use client'

import { useState, useEffect } from 'react'
import PhotoCarousel from '@/components/PhotoCarousel'
import ScheduleGridAdjuster from '@/components/ScheduleGridAdjuster'

interface TimeSlot {
  id: string
  time: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
}

export default function ExplorerContent() {
  const [timetable, setTimetable] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimetable()
  }, [])

  const fetchTimetable = async () => {
    try {
      const response = await fetch('/api/timetable?type=explorer')
      if (response.ok) {
        const { timetable } = await response.json()
        if (timetable) {
          setTimetable(timetable)
        }
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityClass = (activity: string) => {
    const activityLower = activity.toLowerCase()
    if (activityLower.includes('arrival') || activityLower.includes('departure')) return 'arrival'
    if (activityLower.includes('snack') || activityLower.includes('break')) return 'snack'
    if (activityLower.includes('lunch')) return 'lunch'
    if (activityLower.includes('rest') || activityLower.includes('quiet')) return 'rest'
    if (activityLower.includes('stem')) return 'stem'
    if (activityLower.includes('sport') || activityLower.includes('swim')) return 'outdoor'
    if (activityLower.includes('art') || activityLower.includes('craft')) return 'art'
    if (activityLower.includes('drama') || activityLower.includes('theatre')) return 'drama'
    if (activityLower.includes('science') || activityLower.includes('lab')) return 'science'
    if (activityLower.includes('tech') || activityLower.includes('coding')) return 'tech'
    if (activityLower.includes('music') || activityLower.includes('dance')) return 'music'
    if (activityLower.includes('nature') || activityLower.includes('environmental')) return 'nature'
    if (activityLower.includes('team') || activityLower.includes('challenge')) return 'challenge'
    if (activityLower.includes('adventure')) return 'adventure'
    if (activityLower.includes('creative') || activityLower.includes('workshop')) return 'creative'
    if (activityLower.includes('showcase') || activityLower.includes('celebration')) return 'celebration'
    if (activityLower.includes('reflection') || activityLower.includes('circle')) return 'review'
    return ''
  }
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

      {/* Slide 21: Unplug, Explore, Create */}
      <section className="slide slide-21">
        <div className="background-layer">
          <img src="/references/backgrounds/21.jpg" alt="Tropical island paradise" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">Unplug, Explore, Create:<br/>Your Waldorf Summer Adventure</h2>
            <p className="adventure-text">Immerse your child in meaningful challenges, hands-on learning, and screen-free activities that inspire growth, creativity, and lifelong memories.</p>
          </div>
        </div>
      </section>

      {/* Slide 22: Beach Day Adventures */}
      <section className="slide slide-22">
        <div className="background-layer">
          <img src="/references/backgrounds/22.jpg" alt="Beach with palm trees" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>IGNITE THEIR POTENTIAL<br/>THIS SUMMER:<br/>BEACH DAY ADVENTURES</h2>
            <p>Weekly beach excursions where children discover marine life, build sand sculptures, and experience the joy of ocean play in a safe, supervised environment.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/22.jpg', alt: 'Children playing on beach' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 23: Exciting Field Trips */}
      <section className="slide slide-23">
        <div className="background-layer">
          <img src="/references/backgrounds/23.jpg" alt="Forest/nature scenes" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">EXCITING FIELD TRIPS</h2>
            <PhotoCarousel 
              photos={[
                { src: '/references/Summer Camp Presentation Images/23.jpg', alt: 'Outdoor excursion 1' },
                { src: '/references/Summer Camp Presentation Images/24.jpg', alt: 'Outdoor excursion 2' },
                { src: '/references/Summer Camp Presentation Images/25.jpg', alt: 'Outdoor excursion 3' }
              ]}
            />
            <p className="field-trip-text">Local excursions to temples, markets, and natural wonders, connecting children with Phuket's rich culture and environment.</p>
          </div>
        </div>
      </section>

      {/* Slide 24: Authentic Thai Cooking */}
      <section className="slide slide-24">
        <div className="background-layer">
          <img src="/references/backgrounds/24.jpg" alt="Beach scene" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>AUTHENTIC<br/>THAI COOKING</h2>
            <p>Hands-on culinary experiences where children learn traditional Thai recipes, explore local ingredients, and develop practical life skills through cooking.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/26.jpg', alt: 'Child cutting vegetables' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 25: Introduction to Muay Thai */}
      <section className="slide slide-25">
        <div className="background-layer">
          <img src="/references/backgrounds/25.jpg" alt="Dark gym/training facility" />
          <div className="background-overlay dark"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel-light">
            <h2>INTRODUCTION TO<br/>MUAY THAI</h2>
            <p>Learn the fundamentals of Thailand's national sport with certified instructors, focusing on respect, discipline, and physical fitness in a safe environment.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/27.jpg', alt: 'Boy with red boxing gloves' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 26: Bushcraft & Outdoor Skills */}
      <section className="slide slide-26">
        <div className="background-layer">
          <img src="/references/backgrounds/26.jpg" alt="Bamboo forest" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>BUSHCRAFT &<br/>OUTDOOR SKILLS</h2>
            <p>Essential outdoor survival skills, shelter building, and nature connection activities that build confidence and environmental awareness.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/28.jpg', alt: 'Adult and children doing outdoor craft' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 27: Artistic Immersion */}
      <section className="slide slide-27">
        <div className="background-layer">
          <img src="/references/backgrounds/27.jpg" alt="Autumn forest" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>ARTISTIC<br/>IMMERSION</h2>
            <p>Explore various art forms from painting and sculpture to natural crafts, fostering creative expression and artistic appreciation.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/29.jpg', alt: 'Collection of painted rocks' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 28: Handcrafts with Purpose */}
      <section className="slide slide-28">
        <div className="background-layer">
          <img src="/references/backgrounds/28.jpg" alt="Wood/logs" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">HANDCRAFTS WITH PURPOSE</h2>
            <PhotoCarousel 
              photos={[
                { src: '/references/Summer Camp Presentation Images/30.jpg', alt: 'Children crafting 1' },
                { src: '/references/Summer Camp Presentation Images/31.jpg', alt: 'Children crafting 2' }
              ]}
            />
            <p className="craft-text">Meaningful projects using natural materials, developing fine motor skills and creating lasting keepsakes.</p>
          </div>
        </div>
      </section>

      {/* Slide 29: Collaborative Games & Movement */}
      <section className="slide slide-29">
        <div className="background-layer">
          <img src="/references/backgrounds/29.jpg" alt="Green grass field" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>COLLABORATIVE GAMES<br/>& MOVEMENT</h2>
            <p>Team sports, cooperative games, and physical challenges that build fitness, teamwork, and leadership skills.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/32.jpg', alt: 'Children playing soccer' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 30: Story & Song */}
      <section className="slide slide-30">
        <div className="background-layer">
          <img src="/references/backgrounds/30.jpg" alt="Nature scene" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>STORY & SONG</h2>
            <p>Musical experiences and storytelling that nurture cultural appreciation, language development, and emotional expression.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/33.jpg', alt: 'Children with adult playing guitar' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 31: Why Choose Summer Camp Question */}
      <section className="slide slide-31">
        <div className="background-layer">
          <img src="/references/backgrounds/31.jpg" alt="Tropical beach paradise" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">Why Choose The Waldorf Phuket<br/>Summer Camp for Your Growing Child?</h2>
          </div>
        </div>
      </section>

      {/* Slide 32: Develop Practical Skills */}
      <section className="slide slide-32">
        <div className="background-layer">
          <img src="/references/backgrounds/32.jpg" alt="Big Buddha Phuket aerial view" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>DEVELOP<br/>PRACTICAL SKILLS:</h2>
            <p>Hands-on learning experiences that build real-world capabilities and problem-solving confidence.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/34.jpg', alt: 'Children working at table' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 33: Experience Cultural Immersion */}
      <section className="slide slide-33">
        <div className="background-layer">
          <img src="/references/backgrounds/33.jpg" alt="Natural landscape" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>EXPERIENCE<br/>CULTURAL IMMERSION:</h2>
            <p>Deep connections with local traditions, customs, and the natural beauty of Phuket.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/35.jpg', alt: 'Children in circle on mat' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 34: Cultivate Creativity & Innovation */}
      <section className="slide slide-34">
        <div className="background-layer">
          <img src="/references/backgrounds/34.jpg" alt="Turquoise wooden texture" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>CULTIVATE CREATIVITY<br/>& INNOVATION:</h2>
            <p>Encouraging original thinking and creative problem-solving through diverse artistic and intellectual challenges.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/36.jpg', alt: 'Children in creative activities' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 35: Foster Resilience & Resourcefulness */}
      <section className="slide slide-35">
        <div className="background-layer">
          <img src="/references/backgrounds/35.jpg" alt="Jungle environment" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>FOSTER RESILIENCE<br/>& RESOURCEFULNESS:</h2>
            <p>Adventure challenges that build mental strength, adaptability, and creative problem-solving skills.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/37.jpg', alt: 'Children on outdoor bridge' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 36: Strengthen Social Bonds */}
      <section className="slide slide-36">
        <div className="background-layer">
          <img src="/references/backgrounds/36.jpg" alt="Phuket coastline aerial" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>STRENGTHEN<br/>SOCIAL BONDS:</h2>
            <p>Collaborative projects and team challenges that build lasting friendships and cooperation skills.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/38.jpg', alt: 'Group holding wooden structure' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 37: Deepen Connection to Nature */}
      <section className="slide slide-37">
        <div className="background-layer">
          <img src="/references/backgrounds/37.jpg" alt="Natural water scene" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>DEEPEN CONNECTION<br/>TO NATURE:</h2>
            <p>Wildlife encounters and environmental education that inspire lifelong conservation values.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/39.jpg', alt: 'Children with elephants' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 38: Experienced & Passionate Mentors */}
      <section className="slide slide-38">
        <div className="background-layer">
          <img src="/references/backgrounds/38.jpg" alt="Outdoor equipment close-up" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="content-wrapper split-layout">
          <div className="text-panel">
            <h2>EXPERIENCED &<br/>PASSIONATE MENTORS:</h2>
            <p>Dedicated educators with specialized skills who guide and inspire your child's growth journey.</p>
          </div>
          
          <PhotoCarousel 
            photos={[
              { src: '/references/Summer Camp Presentation Images/40.jpg', alt: 'Instructor teaching martial arts' }
            ]}
            className="feature-photo"
          />
        </div>
      </section>

      {/* Slide 39: Summer Camp Schedule (Explorers) */}
      <section className="slide slide-39" id="explorer-schedule-section">
        <div className="background-layer">
          <img src="/references/backgrounds/39.jpg" alt="Grass field" />
          <div className="background-overlay green-tint"></div>
        </div>
        
        <div className="content-wrapper">
          <div className="centered-content">
            <h2 className="section-title-white">Summer Camp Schedule - Explorers (Ages 7-13)</h2>
            <div className="schedule-container">
              {loading ? (
                <div className="schedule-loading">Loading schedule...</div>
              ) : timetable.length > 0 ? (
                <div className="schedule-grid">
                  <div className="time-column">
                    <div className="time-header">&nbsp;</div>
                    {timetable.map(slot => (
                      <div key={slot.id} className="time-slot">{slot.time}</div>
                    ))}
                  </div>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                    <div key={day} className="day-column">
                      <div className="day-header">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                      {timetable.map(slot => (
                        <div key={slot.id} className={`activity ${getActivityClass(slot[day as keyof TimeSlot] as string)}`}>
                          {slot[day as keyof TimeSlot]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="schedule-grid">
                  <div className="time-column">
                    <div className="time-header">&nbsp;</div>
                    <div className="time-slot">8:00 - 8:45</div>
                    <div className="time-slot">8:45 - 10:15</div>
                    <div className="time-slot">10:15 - 10:45</div>
                    <div className="time-slot">10:45 - 12:00</div>
                    <div className="time-slot">12:00 - 1:00</div>
                    <div className="time-slot">1:00 - 2:00</div>
                    <div className="time-slot">2:00 - 3:30</div>
                    <div className="time-slot">3:30 - 4:00</div>
                    <div className="time-slot">4:00 - 4:30</div>
                  </div>
                  <div className="day-column">
                    <div className="day-header">Monday</div>
                    <div className="activity arrival">Arrival & Morning Circle</div>
                    <div className="activity stem">STEM Activities</div>
                    <div className="activity snack">Morning Snack</div>
                    <div className="activity adventure">Adventure Activities</div>
                    <div className="activity lunch">Lunch</div>
                    <div className="activity rest">Quiet Time/Reading</div>
                    <div className="activity creative">Creative Workshop</div>
                    <div className="activity snack">Afternoon Snack</div>
                    <div className="activity departure">Reflection & Departure</div>
                  </div>
                  <div className="day-column">
                    <div className="day-header">Tuesday</div>
                    <div className="activity arrival">Arrival & Morning Circle</div>
                    <div className="activity art">Arts & Crafts</div>
                    <div className="activity snack">Morning Snack</div>
                    <div className="activity drama">Drama & Theatre</div>
                    <div className="activity lunch">Lunch</div>
                    <div className="activity rest">Quiet Time/Reading</div>
                    <div className="activity science">Science Lab</div>
                    <div className="activity snack">Afternoon Snack</div>
                    <div className="activity departure">Reflection & Departure</div>
                  </div>
                  <div className="day-column">
                    <div className="day-header">Wednesday</div>
                    <div className="activity arrival">Arrival & Morning Circle</div>
                    <div className="activity outdoor">Sports & Games</div>
                    <div className="activity snack">Morning Snack</div>
                    <div className="activity outdoor">Swimming</div>
                    <div className="activity lunch">Lunch</div>
                    <div className="activity rest">Quiet Time/Reading</div>
                    <div className="activity music">Music & Dance</div>
                    <div className="activity snack">Afternoon Snack</div>
                    <div className="activity departure">Reflection & Departure</div>
                  </div>
                  <div className="day-column">
                    <div className="day-header">Thursday</div>
                    <div className="activity arrival">Arrival & Morning Circle</div>
                    <div className="activity nature">Nature Exploration</div>
                    <div className="activity snack">Morning Snack</div>
                    <div className="activity tech">Coding & Tech</div>
                    <div className="activity lunch">Lunch</div>
                    <div className="activity rest">Quiet Time/Reading</div>
                    <div className="activity nature">Environmental Project</div>
                    <div className="activity snack">Afternoon Snack</div>
                    <div className="activity departure">Reflection & Departure</div>
                  </div>
                  <div className="day-column">
                    <div className="day-header">Friday</div>
                    <div className="activity arrival">Arrival & Morning Circle</div>
                    <div className="activity challenge">Weekly Challenge</div>
                    <div className="activity snack">Morning Snack</div>
                    <div className="activity challenge">Team Building</div>
                    <div className="activity lunch">Lunch</div>
                    <div className="activity rest">Quiet Time/Reading</div>
                    <div className="activity celebration">Showcase Prep</div>
                    <div className="activity snack">Afternoon Snack</div>
                    <div className="activity departure">Reflection & Departure</div>
                  </div>
                </div>
              )}
              <ScheduleGridAdjuster />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}