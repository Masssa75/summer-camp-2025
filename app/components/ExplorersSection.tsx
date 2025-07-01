import Image from 'next/image'

export default function ExplorersSection() {
  const activities = [
    {
      title: "Thai Cooking Classes",
      description: "Learn to prepare authentic Thai dishes using fresh, local ingredients",
      icon: "🍜"
    },
    {
      title: "Introduction to Muay Thai",
      description: "Experience Thailand's national sport through engaging, age-appropriate sessions",
      icon: "🥊"
    },
    {
      title: "Bushcraft & Survival Skills",
      description: "Learn essential outdoor skills and connect with nature",
      icon: "🏕️"
    },
    {
      title: "Arts & Traditional Crafts",
      description: "Create beautiful works inspired by Thai culture and natural materials",
      icon: "🎨"
    },
    {
      title: "Beach & Water Activities",
      description: "Safe water sports and beach exploration in tropical paradise",
      icon: "🏖️"
    },
    {
      title: "Cultural Exploration",
      description: "Visit local temples, markets, and experience Thai traditions",
      icon: "🏛️"
    }
  ]

  return (
    <section className="py-20 px-4 bg-green-800 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            For Our Growing Adventurers
          </h2>
          <p className="text-3xl text-green-200 mb-4">The Explorers (Ages 7-13)</p>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            An action-packed program blending adventure, culture, and personal growth in the heart of Phuket
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-16">
          <Image
            src="/images/presentation/20.jpg"
            alt="Explorers group in nature"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-800/50 to-transparent" />
          <div className="absolute left-8 bottom-8 max-w-xl">
            <h3 className="text-3xl font-bold mb-4">Adventure Awaits!</h3>
            <p className="text-lg">
              Join us for an unforgettable summer of discovery, challenge, and growth
            </p>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{activity.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
              <p className="text-green-100">{activity.description}</p>
            </div>
          ))}
        </div>

        {/* Special Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-[300px] rounded-2xl overflow-hidden">
            <Image
              src="/images/presentation/25.jpg"
              alt="Muay Thai training"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4">Building Confidence Through Adventure</h3>
            <p className="text-lg text-green-100 mb-6">
              Our Explorers program is designed to challenge and inspire older children, 
              fostering independence, cultural awareness, and a deep connection with nature.
            </p>
            <ul className="space-y-3 text-green-100">
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                Small group sizes for personalized attention
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                Expert instructors in all activities
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                Focus on teamwork and leadership skills
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                Daily reflection and journaling time
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-white text-green-800 hover:bg-green-50 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Explore the Explorers Program
          </button>
        </div>
      </div>
    </section>
  )
}