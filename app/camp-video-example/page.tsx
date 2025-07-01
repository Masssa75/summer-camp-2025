'use client';

import BackgroundVideo from '@/components/BackgroundVideo';
import HeroWithVideo from '@/components/HeroWithVideo';
import { useState } from 'react';

// Example video sources - replace with your actual videos
const CAMP_VIDEOS = {
  // Main hero video - kids playing, swimming, general camp activities
  hero: 'https://cdn.coverr.co/videos/coverr-kids-playing-in-the-park-7996/1080p.mp4',
  
  // Activity-specific videos
  swimming: 'https://cdn.coverr.co/videos/coverr-swimming-pool-from-above-9473/1080p.mp4',
  nature: 'https://cdn.coverr.co/videos/coverr-forest-path-1569/1080p.mp4',
  arts: 'https://cdn.coverr.co/videos/coverr-painting-9474/1080p.mp4',
  sports: 'https://cdn.coverr.co/videos/coverr-basketball-court-5247/1080p.mp4',
  
  // Atmosphere videos
  campfire: 'https://cdn.coverr.co/videos/coverr-campfire-1573/1080p.mp4',
  sunrise: 'https://cdn.coverr.co/videos/coverr-sunrise-over-mountains-1578/1080p.mp4'
};

export default function CampVideoExample() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Video Background */}
      <HeroWithVideo
        videoSrc={CAMP_VIDEOS.hero}
        title="Summer Camp 2025"
        subtitle="Where Adventures Begin and Friendships Last Forever"
        ctaText="Register Your Child"
        ctaAction={() => window.location.href = '/registration'}
      />

      {/* Welcome Section with Fixed Video Background */}
      <section className="relative py-20">
        <BackgroundVideo
          src={CAMP_VIDEOS.sunrise}
          overlay={true}
          overlayOpacity={0.7}
          className="absolute inset-0 h-full"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome to Our Summer Camp</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            For over 20 years, we've been creating unforgettable summer experiences 
            for children aged 6-14. Our camp combines outdoor adventures, creative 
            activities, and skill-building in a safe, nurturing environment.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">500+</h3>
              <p>Happy Campers Every Summer</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">50+</h3>
              <p>Exciting Activities</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">1:6</h3>
              <p>Counselor to Camper Ratio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section with Video Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Camp Activities</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Swimming */}
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setSelectedActivity('swimming')}
              onMouseLeave={() => setSelectedActivity(null)}
            >
              <BackgroundVideo
                src={CAMP_VIDEOS.swimming}
                overlay={true}
                overlayOpacity={selectedActivity === 'swimming' ? 0.3 : 0.5}
                className="h-64 rounded-lg overflow-hidden transition-all"
              >
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Swimming</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Daily swim lessons and water games
                    </p>
                  </div>
                </div>
              </BackgroundVideo>
            </div>

            {/* Nature Exploration */}
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setSelectedActivity('nature')}
              onMouseLeave={() => setSelectedActivity(null)}
            >
              <BackgroundVideo
                src={CAMP_VIDEOS.nature}
                overlay={true}
                overlayOpacity={selectedActivity === 'nature' ? 0.3 : 0.5}
                className="h-64 rounded-lg overflow-hidden transition-all"
              >
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Nature</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Hiking, wildlife observation, camping
                    </p>
                  </div>
                </div>
              </BackgroundVideo>
            </div>

            {/* Arts & Crafts */}
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setSelectedActivity('arts')}
              onMouseLeave={() => setSelectedActivity(null)}
            >
              <BackgroundVideo
                src={CAMP_VIDEOS.arts}
                overlay={true}
                overlayOpacity={selectedActivity === 'arts' ? 0.3 : 0.5}
                className="h-64 rounded-lg overflow-hidden transition-all"
              >
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Arts & Crafts</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Painting, pottery, jewelry making
                    </p>
                  </div>
                </div>
              </BackgroundVideo>
            </div>

            {/* Sports */}
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setSelectedActivity('sports')}
              onMouseLeave={() => setSelectedActivity(null)}
            >
              <BackgroundVideo
                src={CAMP_VIDEOS.sports}
                overlay={true}
                overlayOpacity={selectedActivity === 'sports' ? 0.3 : 0.5}
                className="h-64 rounded-lg overflow-hidden transition-all"
              >
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Sports</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Basketball, soccer, volleyball
                    </p>
                  </div>
                </div>
              </BackgroundVideo>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section with Subtle Video Background */}
      <section className="relative py-20">
        <BackgroundVideo
          src={CAMP_VIDEOS.campfire}
          overlay={true}
          overlayOpacity={0.8}
          className="absolute inset-0 h-full"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">What Parents Say</h2>
          <blockquote className="text-xl italic mb-4">
            "My daughter has been attending this camp for 3 years now, and she 
            counts down the days until summer! The counselors are amazing, and 
            she's learned so many new skills while having the time of her life."
          </blockquote>
          <p className="text-lg">- Sarah M., Parent</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for an Amazing Summer?</h2>
          <p className="text-xl mb-8">
            Limited spots available. Register now to secure your child's place!
          </p>
          <button className="bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Registration
          </button>
        </div>
      </section>

      {/* Video Implementation Guide */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Implementation Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">1. Preparing Your Videos</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`# Using FFmpeg to optimize videos
ffmpeg -i input.mp4 -c:v libx264 -crf 23 
  -preset fast -c:a aac -b:a 128k 
  -movflags +faststart output.mp4

# Create multiple resolutions
# Mobile (720p)
ffmpeg -i input.mp4 -vf scale=1280:720 
  -c:v libx264 -crf 28 mobile.mp4

# Desktop (1080p)
ffmpeg -i input.mp4 -vf scale=1920:1080 
  -c:v libx264 -crf 23 desktop.mp4`}
              </pre>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">2. Hosting Options</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Cloudinary (Recommended)</h4>
                  <p className="text-sm text-gray-600">Free 25GB, automatic optimization</p>
                </div>
                <div>
                  <h4 className="font-semibold">Bunny CDN</h4>
                  <p className="text-sm text-gray-600">$0.01/GB, great performance</p>
                </div>
                <div>
                  <h4 className="font-semibold">AWS S3 + CloudFront</h4>
                  <p className="text-sm text-gray-600">Scalable, pay-as-you-go</p>
                </div>
                <div>
                  <h4 className="font-semibold">Vercel/Netlify</h4>
                  <p className="text-sm text-gray-600">Include in public folder (small videos only)</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">3. Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Keep videos under 10MB for fast loading</li>
                <li>✓ Use MP4 format with H.264 codec</li>
                <li>✓ Always include poster image for loading state</li>
                <li>✓ Mute videos for autoplay to work</li>
                <li>✓ Consider reduced motion preferences</li>
                <li>✓ Test on mobile devices and slow connections</li>
                <li>✓ Provide fallback images for older browsers</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">4. Responsive Loading</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`// Load different videos based on screen size
const VideoSource = () => {
  const [videoSrc, setVideoSrc] = useState('');
  
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setVideoSrc(isMobile 
      ? '/videos/hero-mobile.mp4' 
      : '/videos/hero-desktop.mp4'
    );
  }, []);
  
  return <BackgroundVideo src={videoSrc} />;
};`}
              </pre>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold mb-2">💡 Pro Tips</h3>
            <ul className="space-y-1 text-sm">
              <li>• Use Handbrake (free) for easy video compression</li>
              <li>• Aim for 30fps, 5-10 second loops for backgrounds</li>
              <li>• Consider using Lottie animations for simple motion graphics</li>
              <li>• Always test autoplay on iOS Safari (most restrictive)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}