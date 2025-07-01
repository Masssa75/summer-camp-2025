'use client';

import BackgroundVideo from '@/components/BackgroundVideo';
import HeroWithVideo from '@/components/HeroWithVideo';
import VideoSection from '@/components/VideoSection';

// Free stock video URLs for testing
const VIDEO_SOURCES = {
  ocean: 'https://cdn.coverr.co/videos/coverr-palm-tree-on-the-beach-2179/1080p.mp4',
  nature: 'https://cdn.coverr.co/videos/coverr-tree-on-the-water-1056/1080p.mp4',
  abstract: 'https://cdn.coverr.co/videos/coverr-abstract-particles-12219/1080p.mp4',
  sunset: 'https://cdn.coverr.co/videos/coverr-sunset-at-the-beach-1580/1080p.mp4'
};

export default function VideoDemoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <HeroWithVideo
        videoSrc={VIDEO_SOURCES.ocean}
        title="Summer Camp 2025"
        subtitle="Adventure Awaits This Summer"
        ctaText="Register Now"
        ctaAction={() => console.log('CTA clicked')}
      />

      {/* Content Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Different Video Background Styles</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">1. Full Screen Hero</h3>
              <p className="text-gray-700">
                The hero section above uses a full-screen video background with overlay text. 
                Perfect for landing pages and dramatic introductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax-style Video Section */}
      <VideoSection
        videoSrc={VIDEO_SOURCES.nature}
        height="h-[500px]"
        position="relative"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white p-8">
            <h2 className="text-5xl font-bold mb-4">Immersive Experience</h2>
            <p className="text-xl">Video sections can break up content beautifully</p>
          </div>
        </div>
      </VideoSection>

      {/* More Content */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8">2. Section Dividers</h3>
          <p className="text-gray-700 mb-8">
            Use video backgrounds as section dividers to create visual interest between content blocks.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Performance Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep videos under 10MB</li>
                <li>• Use MP4 format for best compatibility</li>
                <li>• Consider mobile data usage</li>
                <li>• Always include poster image</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Accessibility</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Videos autoplay muted</li>
                <li>• No essential information in video only</li>
                <li>• Provide alternative content</li>
                <li>• Consider motion preferences</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Small Video Background Card */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">3. Video Cards</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <BackgroundVideo
              src={VIDEO_SOURCES.abstract}
              overlay={true}
              overlayOpacity={0.6}
              className="h-80 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center text-white">
                  <h4 className="text-3xl font-bold mb-2">Creative Arts</h4>
                  <p>Express yourself through various mediums</p>
                </div>
              </div>
            </BackgroundVideo>

            <BackgroundVideo
              src={VIDEO_SOURCES.sunset}
              overlay={true}
              overlayOpacity={0.6}
              className="h-80 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center text-white">
                  <h4 className="text-3xl font-bold mb-2">Outdoor Adventures</h4>
                  <p>Explore nature and build confidence</p>
                </div>
              </div>
            </BackgroundVideo>
          </div>
        </div>
      </section>

      {/* Fixed Background Example */}
      <VideoSection videoSrc={VIDEO_SOURCES.ocean} position="fixed">
        <section className="py-20 px-4 bg-white bg-opacity-95">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold mb-8">4. Fixed Background Effect</h3>
            <p className="text-gray-700 mb-4">
              This section has a fixed video background that stays in place while you scroll.
              Great for creating parallax-like effects.
            </p>
            <div className="h-96 flex items-center justify-center">
              <p className="text-xl text-gray-600">Scroll to see the effect!</p>
            </div>
          </div>
        </section>
      </VideoSection>

      {/* Usage Examples */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">How to Use</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-3">Basic Background Video</h4>
              <pre className="bg-black p-4 rounded overflow-x-auto">
{`<BackgroundVideo
  src="/videos/summer-camp.mp4"
  overlay={true}
  overlayOpacity={0.5}
  className="h-96"
>
  <div>Your content here</div>
</BackgroundVideo>`}
              </pre>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-3">Hero Section</h4>
              <pre className="bg-black p-4 rounded overflow-x-auto">
{`<HeroWithVideo
  videoSrc="/videos/hero.mp4"
  title="Welcome to Camp"
  subtitle="Make memories that last"
  ctaText="Join Us"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}