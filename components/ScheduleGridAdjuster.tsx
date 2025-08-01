'use client'

import { useEffect } from 'react'

export default function ScheduleGridAdjuster() {
  useEffect(() => {
    const adjustRowHeights = () => {
      const scheduleGrid = document.querySelector('.schedule-grid')
      if (!scheduleGrid) return

      const timeColumn = scheduleGrid.querySelector('.time-column')
      const dayColumns = scheduleGrid.querySelectorAll('.day-column')
      
      if (!timeColumn || dayColumns.length === 0) return

      // First, adjust header row
      const timeHeader = timeColumn.querySelector('.time-header')
      const dayHeaders = Array.from(dayColumns)
        .map(col => col.querySelector('.day-header'))
        .filter((header): header is HTMLElement => header !== null)
      
      if (timeHeader && dayHeaders.length > 0) {
        // Find max header height
        let maxHeaderHeight = 0
        const headerCells: HTMLElement[] = [timeHeader as HTMLElement, ...dayHeaders]
        
        headerCells.forEach(cell => {
          cell.style.height = 'auto'
          const height = cell.getBoundingClientRect().height
          if (height > maxHeaderHeight) maxHeaderHeight = height
        })
        
        maxHeaderHeight = Math.ceil(maxHeaderHeight)
        
        // Apply to all headers
        headerCells.forEach(cell => {
          cell.style.minHeight = `${maxHeaderHeight}px`
          cell.style.height = `${maxHeaderHeight}px`
        })
      }

      // Get all rows (skip header row)
      const rowCount = timeColumn.querySelectorAll('.time-slot').length
      
      for (let i = 0; i < rowCount; i++) {
        // Get all cells in this row
        const rowCells: HTMLElement[] = []
        
        // Add time slot
        const timeSlot = timeColumn.children[i + 1] // +1 to skip header
        if (timeSlot instanceof HTMLElement) rowCells.push(timeSlot)
        
        // Add activity cells from each day
        dayColumns.forEach(column => {
          const cell = column.children[i + 1] // +1 to skip header
          if (cell instanceof HTMLElement) rowCells.push(cell)
        })
        
        // Find max height in this row
        let maxHeight = 0
        rowCells.forEach(cell => {
          cell.style.height = 'auto' // Reset height
          const height = cell.getBoundingClientRect().height
          if (height > maxHeight) maxHeight = height
        })
        
        // Round up to nearest pixel to avoid sub-pixel differences
        maxHeight = Math.ceil(maxHeight)
        
        // Apply max height to all cells in row
        rowCells.forEach(cell => {
          cell.style.minHeight = `${maxHeight}px`
          cell.style.height = `${maxHeight}px`
        })
      }
    }

    // Run on mount and window resize
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(adjustRowHeights, 100)
    
    // Also run after a longer delay to catch any late-loading content
    setTimeout(adjustRowHeights, 500)
    setTimeout(adjustRowHeights, 1000)
    
    window.addEventListener('resize', adjustRowHeights)
    
    // Also run when fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(adjustRowHeights, 100)
      })
    }

    return () => {
      window.removeEventListener('resize', adjustRowHeights)
    }
  }, [])

  return null
}