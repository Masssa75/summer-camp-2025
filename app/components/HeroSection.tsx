'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/backgrounds/1.jpg"
          alt="Beautiful Phuket coastline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-white/90 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-green-600" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
                <path d="M50 20 C30 35, 30 65, 50 80 C70 65, 70 35, 50 20" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            SUMMER
          </h1>
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            CAMP
          </h1>
          
          <p className="text-2xl md:text-3xl mb-4 font-light">
            The Waldorf Phuket
          </p>
          
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Where nature meets nurture in tropical paradise
          </p>

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Discover Our Programs
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}