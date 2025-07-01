import Image from 'next/image'

export default function AboutSection() {
  return (
    <section className="py-20 px-4 bg-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-green-800">
              Waldorf-Inspired Summer Camp
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Discover the magic of childhood this summer at our Waldorf-inspired camp in beautiful Phuket, Thailand.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our camp offers a nurturing haven where childhood blossoms at its own pace, surrounded by nature's wonders and guided by experienced educators who understand the importance of play, creativity, and connection.
            </p>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">2</div>
                <div className="text-sm text-gray-600">Age Groups</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">20+</div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Nature-Based</div>
              </div>
            </div>
          </div>

          {/* Right side - Image collage */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4">
                <div className="relative h-[240px] rounded-xl overflow-hidden">
                  <Image
                    src="/images/presentation/2.jpg"
                    alt="Children playing"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-[240px] rounded-xl overflow-hidden">
                  <Image
                    src="/images/presentation/7.jpg"
                    alt="Nature activities"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative h-full rounded-xl overflow-hidden">
                <Image
                  src="/images/presentation/10.jpg"
                  alt="Outdoor learning"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}