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

      // Get all rows (skip header row)
      const rowCount = timeColumn.querySelectorAll('.time-slot').length
      
      for (let i = 0; i < rowCount; i++) {
        // Get all cells in this row
        const rowCells = []
        
        // Add time slot
        const timeSlot = timeColumn.children[i + 1] // +1 to skip header
        if (timeSlot) rowCells.push(timeSlot)
        
        // Add activity cells from each day
        dayColumns.forEach(column => {
          const cell = column.children[i + 1] // +1 to skip header
          if (cell) rowCells.push(cell)
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
          cell.style.height = `${maxHeight}px`
        })
      }
    }

    // Run on mount and window resize
    adjustRowHeights()
    window.addEventListener('resize', adjustRowHeights)
    
    // Also run when fonts load
    if (document.fonts) {
      document.fonts.ready.then(adjustRowHeights)
    }

    return () => {
      window.removeEventListener('resize', adjustRowHeights)
    }
  }, [])

  return null
}