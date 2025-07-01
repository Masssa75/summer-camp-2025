'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ActivitiesSection() {
  const [selectedActivity, setSelectedActivity] = useState(0)

  const activities = [
    {
      title: "Beach Adventures",
      description: "Explore pristine beaches, build sandcastles, and learn about marine ecosystems",
      image: "/images/presentation/10.jpg",
      details: ["Beach games", "Tide pool exploration", "Sand art", "Swimming safety"]
    },
    {
      title: "Arts & Crafts",
      description: "Express creativity through various artistic mediums inspired by nature",
      image: "/images/presentation/11.jpg",
      details: ["Natural dyeing", "Clay modeling", "Painting", "Weaving"]
    },
    {
      title: "Thai Culture",
      description: "Immerse in local traditions, cooking, and cultural practices",
      image: "/images/presentation/23.jpg",
      details: ["Thai cooking", "Traditional dance", "Temple visits", "Local markets"]
    },
    {
      title: "Nature Connection",
      description: "Deep nature experiences fostering environmental awareness",
      image: "/images/presentation/14.jpg",
      details: ["Forest walks", "Wildlife observation", "Gardening", "Eco-projects"]
    },
    {
      title: "Physical Activities",
      description: "Build strength, coordination, and confidence through movement",
      image: "/images/presentation/25.jpg",
      details: ["Muay Thai basics", "Yoga", "Team sports", "Obstacle courses"]
    },
    {
      title: "Life Skills",
      description: "Practical skills for independence and personal growth",
      image: "/images/presentation/30.jpg",
      details: ["Bushcraft", "First aid basics", "Problem solving", "Leadership"]
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-800 mb-4">
            A World of Discovery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every day brings new adventures and opportunities for growth through our diverse activity program
          </p>
        </div>

        {/* Activity Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {activities.map((activity, index) => (
            <button
              key={index}
              onClick={() => setSelectedActivity(index)}
              className={`p-4 rounded-xl text-center transition-all duration-300 ${
                selectedActivity === index
                  ? 'bg-green-600 text-white transform scale-105'
                  : 'bg-white hover:bg-green-50 text-gray-700'
              }`}
            >
              <div className="font-semibold">{activity.title}</div>
            </button>
          ))}
        </div>

        {/* Activity Details */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={activities[selectedActivity].image}
              alt={activities[selectedActivity].title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-green-800">
              {activities[selectedActivity].title}
            </h3>
            <p className="text-xl text-gray-600">
              {activities[selectedActivity].description}
            </p>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-green-700">What children will experience:</h4>
              <ul className="grid grid-cols-2 gap-3">
                {activities[selectedActivity].details.map((detail, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-green-800 italic">
                "Every activity is carefully designed to support children's development while 
                honoring their natural curiosity and wonder."
              </p>
            </div>
          </div>
        </div>

        {/* Photo Gallery Preview */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-green-800 mb-8">
            Moments from Our Activities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[31, 32, 33, 34].map((num) => (
              <div key={num} className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={`/images/presentation/${num}.jpg`}
                  alt="Camp activities"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}