import Image from 'next/image'

export default function PhilosophySection() {
  const principles = [
    {
      title: "Holistic Development",
      description: "Nurturing the head, heart, and hands - developing thinking, feeling, and willing in harmony",
      icon: "🌱"
    },
    {
      title: "Nature as Teacher",
      description: "The natural world provides endless opportunities for learning and growth",
      icon: "🌿"
    },
    {
      title: "Rhythm & Routine",
      description: "Predictable daily and weekly rhythms create security and healthy habits",
      icon: "🌅"
    },
    {
      title: "Screen-Free Environment",
      description: "Real experiences and human connections replace digital distractions",
      icon: "👥"
    },
    {
      title: "Age-Appropriate Activities",
      description: "Each program is carefully designed to meet children where they are developmentally",
      icon: "🎯"
    },
    {
      title: "Cultural Integration",
      description: "Embracing Thai culture and traditions as part of the learning journey",
      icon: "🏮"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-800 mb-4">
            The Waldorf Approach
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our philosophy is rooted in Rudolf Steiner's insights into child development, 
            adapted for the unique beauty and culture of Phuket
          </p>
        </div>

        {/* Hero Image with Quote */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-16">
          <Image
            src="/images/presentation/15.jpg"
            alt="Children in nature"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
            <blockquote className="text-2xl md:text-3xl font-light italic mb-4">
              "Receive the children in reverence, educate them in love, 
              and send them forth in freedom"
            </blockquote>
            <cite className="text-lg">- Rudolf Steiner</cite>
          </div>
        </div>

        {/* Principles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {principles.map((principle, index) => (
            <div key={index} className="text-center group">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {principle.icon}
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                {principle.title}
              </h3>
              <p className="text-gray-600">
                {principle.description}
              </p>
            </div>
          ))}
        </div>

        {/* Supporting Development Section */}
        <div className="bg-green-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-green-800 mb-6">
                Supporting Every Child's Journey
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                At The Waldorf Phuket Summer Camp, we believe every child is unique. 
                Our approach honors individual development while fostering community and connection.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span>Small group sizes ensure individual attention</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span>Experienced teachers trained in Waldorf pedagogy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span>Daily observations inform our approach to each child</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span>Parent communication keeps families connected</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/images/presentation/35.jpg"
                alt="Waldorf education in action"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}