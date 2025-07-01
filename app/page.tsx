import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import MiniGroupSection from './components/MiniGroupSection'
import ExplorersSection from './components/ExplorersSection'
import ActivitiesSection from './components/ActivitiesSection'
import PhilosophySection from './components/PhilosophySection'
import ContactSection from './components/ContactSection'

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <MiniGroupSection />
      <ExplorersSection />
      <ActivitiesSection />
      <PhilosophySection />
      <ContactSection />
    </main>
  )
}