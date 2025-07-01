'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ExplorerRegistrationForm from '@/components/ExplorerRegistrationForm'
import MiniRegistrationForm from '@/components/MiniRegistrationForm'
import TopNavigation from '@/components/TopNavigation'
import '../styles/registration.css'
import '../styles/carousel-brochure.css'

function RegisterContent() {
  const searchParams = useSearchParams()
  const [ageGroup, setAgeGroup] = useState<'mini' | 'explorer'>('explorer')
  
  useEffect(() => {
    const group = searchParams.get('group')
    if (group === 'mini' || group === 'explorer') {
      setAgeGroup(group)
    }
  }, [searchParams])

  return (
    <>
      <TopNavigation onAgeGroupSelect={setAgeGroup} />
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-header">
            <h1>Summer Camp 2025 Registration</h1>
            <div className="age-group-selector">
              <button 
                className={`age-btn ${ageGroup === 'mini' ? 'active' : ''}`}
                onClick={() => setAgeGroup('mini')}
              >
                Mini Camp (3-6 years)
              </button>
              <button 
                className={`age-btn ${ageGroup === 'explorer' ? 'active' : ''}`}
                onClick={() => setAgeGroup('explorer')}
              >
                Explorer Camp (7-13 years)
              </button>
            </div>
          </div>

          {ageGroup === 'mini' ? (
            <MiniRegistrationForm />
          ) : (
            <ExplorerRegistrationForm />
          )}
        </div>
      </div>
    </>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-header">
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}