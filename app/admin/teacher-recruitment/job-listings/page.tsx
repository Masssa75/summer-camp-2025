'use client'

import { Shield, FileText, Users, Target, Award, Clock, MapPin, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function JobListingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-gray-700" />
              <h1 className="text-xl font-semibold text-gray-900">Teacher Positions</h1>
            </div>
            <Link href="/admin/teacher-recruitment" className="text-blue-600 hover:text-blue-700 text-sm">
              ← Back to Recruitment
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Placeholder Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Teaching Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're looking for passionate educators who believe in discovering each child's unique potential
          </p>
        </div>

        {/* Current Openings */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Current Openings</h3>
          
          <div className="grid gap-6">
            {/* Position 1 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">Lead Teacher - Mini Camp (Ages 3-6)</h4>
                  <p className="text-gray-600 mt-1">Full-time position for our early childhood program</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Open</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Phuket, Thailand</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Full-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>3-6 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>Competitive</span>
                </div>
              </div>
            </div>

            {/* Position 2 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">Assistant Teacher - Explorer Camp (Ages 7-13)</h4>
                  <p className="text-gray-600 mt-1">Support our adventure-based learning program</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Open</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Phuket, Thailand</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Full-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>7-13 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>Competitive</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* General Requirements */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">General Requirements</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Award size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Bachelor's degree in Education or related field</span>
              </li>
              <li className="flex items-start gap-3">
                <Award size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Teaching certification or equivalent experience</span>
              </li>
              <li className="flex items-start gap-3">
                <Award size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Experience with child-centered or alternative education approaches</span>
              </li>
              <li className="flex items-start gap-3">
                <Award size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>English proficiency (native or near-native level)</span>
              </li>
              <li className="flex items-start gap-3">
                <Award size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Valid work permit for Thailand (or eligibility to obtain one)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">What We Offer</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Benefits</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Competitive salary based on experience</li>
                <li>• Health insurance coverage</li>
                <li>• Professional development opportunities</li>
                <li>• Visa and work permit assistance</li>
                <li>• Paid holidays and school breaks</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Our Environment</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Beautiful 3.5-rai palm plantation campus</li>
                <li>• Small class sizes (max 15 students)</li>
                <li>• Supportive, collaborative team</li>
                <li>• Focus on outdoor and nature-based learning</li>
                <li>• Innovative, child-centered approach</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">How to Apply</h3>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Interested candidates should send the following to <a href="mailto:careers@bamboo-valley.com" className="text-blue-600 hover:underline">careers@bamboo-valley.com</a>:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Updated CV/Resume</li>
              <li>Cover letter explaining your interest in alternative education</li>
              <li>Teaching certifications and qualifications</li>
              <li>Contact information for 2-3 professional references</li>
            </ol>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            For questions about teaching positions, contact us at{' '}
            <a href="mailto:careers@bamboo-valley.com" className="text-blue-600 hover:underline">
              careers@bamboo-valley.com
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}