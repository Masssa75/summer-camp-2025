'use client'

import { useState } from 'react'
import ExplorerRegistrationForm from './ExplorerRegistrationForm'

export default function MiniRegistrationForm() {
  // For now, use the same form as Explorer but with age group set to 'mini'
  // You can customize this later if needed
  return <ExplorerRegistrationForm ageGroup="mini" />
}