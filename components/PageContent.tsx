'use client'

import MiniContent from '@/components/MiniContent'
import ExplorerContent from '@/components/ExplorerContent'

interface PageContentProps {
  ageGroup: 'mini' | 'explorer'
}

export default function PageContent({ ageGroup }: PageContentProps) {
  if (ageGroup === 'mini') {
    return <MiniContent />
  }
  
  return <ExplorerContent />
}