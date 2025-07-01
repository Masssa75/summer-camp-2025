'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function MiniGroupSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Gentle Rhythms & Predictable Days",
      description: "A consistent flow of activities that respects your child's natural need for security and ease.",
      image: "/images/presentation/5.jpg"
    },
    {
      title: "Animal Care & Connection",
      description: "Daily interactions with our gentle farm animals, fostering empathy and responsibility.",
      image: "/images/presentation/6.jpg"
    },
    {
      title: "Creative Play & Arts",
      description: "Hands-on activities including painting, crafts, and imaginative play in our prepared environments.",
      image: "/images/presentation/7.jpg"
    },
    {
      title: "Nature Exploration",
      description: "Safe outdoor adventures exploring the wonders of our tropical surroundings.",
      image: "/images/presentation/8.jpg"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-800 mb-4">
            For Our Youngest Explorers
          </h2>
          <p className="text-3xl text-green-600 mb-4">(AGES 3-6)</p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our Waldorf-inspired Mini Group offers a nurturing haven where childhood blossoms at its own pace.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-green-100 border-2 border-green-400'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right - Dynamic Image */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden sticky top-8">
            <Image
              src={features[activeFeature].image}
              alt={features[activeFeature].title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            
            {/* Daily Schedule Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h4 className="text-2xl font-semibold mb-4">Sample Daily Rhythm</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="font-semibold">8:00 - 9:00</div>
                  <div>Welcome Circle & Morning Songs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="font-semibold">9:00 - 10:30</div>
                  <div>Nature Walk & Discovery</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="font-semibold">10:30 - 12:00</div>
                  <div>Creative Activities</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="font-semibold">12:00 - 1:00</div>
                  <div>Lunch & Rest Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Learn More About Mini Group
          </button>
        </div>
      </div>
    </section>
  )
}