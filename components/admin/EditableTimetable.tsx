'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Edit2, X, Check, Users, Baby } from 'lucide-react'

interface TimeSlot {
  id: string
  time: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
}

const defaultMiniTimetable: TimeSlot[] = [
  { id: '1', time: '8:15 - 9:00', monday: 'Arrival & Free Play', tuesday: 'Arrival & Free Play', wednesday: 'Arrival & Free Play', thursday: 'Arrival & Free Play', friday: 'Arrival & Free Play' },
  { id: '2', time: '9:00 - 10:30', monday: 'Handwork & Crafts', tuesday: 'Cooking & Baking', wednesday: 'Animal Care', thursday: 'Sensory Play', friday: 'Weekly Celebration' },
  { id: '3', time: '10:30 - 11:00', monday: 'Morning Snack', tuesday: 'Morning Snack', wednesday: 'Morning Snack', thursday: 'Morning Snack', friday: 'Morning Snack' },
  { id: '4', time: '11:00 - 12:00', monday: 'Outdoor Play', tuesday: 'Nature Walk', wednesday: 'Garden Work', thursday: 'Outdoor Adventures', friday: 'Free Choice Activities' },
  { id: '5', time: '12:00 - 1:00', monday: 'Lunch', tuesday: 'Lunch', wednesday: 'Lunch', thursday: 'Lunch', friday: 'Lunch' },
  { id: '6', time: '1:00 - 2:00', monday: 'Rest Time', tuesday: 'Rest Time', wednesday: 'Rest Time', thursday: 'Rest Time', friday: 'Rest Time' },
  { id: '7', time: '2:00 - 3:30', monday: 'Story & Music', tuesday: 'Art & Painting', wednesday: 'Puppetry & Drama', thursday: 'Movement & Games', friday: 'Week Review' },
  { id: '8', time: '3:30 - 4:00', monday: 'Afternoon Snack', tuesday: 'Afternoon Snack', wednesday: 'Afternoon Snack', thursday: 'Afternoon Snack', friday: 'Afternoon Snack' },
  { id: '9', time: '4:00 - 4:30', monday: 'Departure', tuesday: 'Departure', wednesday: 'Departure', thursday: 'Departure', friday: 'Departure' }
]

const defaultExplorerTimetable: TimeSlot[] = [
  { id: '1', time: '8:00 - 8:45', monday: 'Arrival & Morning Circle', tuesday: 'Arrival & Morning Circle', wednesday: 'Arrival & Morning Circle', thursday: 'Arrival & Morning Circle', friday: 'Arrival & Morning Circle' },
  { id: '2', time: '8:45 - 10:15', monday: 'STEM Activities', tuesday: 'Arts & Crafts', wednesday: 'Sports & Games', thursday: 'Nature Exploration', friday: 'Weekly Challenge' },
  { id: '3', time: '10:15 - 10:45', monday: 'Morning Snack', tuesday: 'Morning Snack', wednesday: 'Morning Snack', thursday: 'Morning Snack', friday: 'Morning Snack' },
  { id: '4', time: '10:45 - 12:00', monday: 'Adventure Activities', tuesday: 'Drama & Theatre', wednesday: 'Swimming', thursday: 'Coding & Tech', friday: 'Team Building' },
  { id: '5', time: '12:00 - 1:00', monday: 'Lunch', tuesday: 'Lunch', wednesday: 'Lunch', thursday: 'Lunch', friday: 'Lunch' },
  { id: '6', time: '1:00 - 2:00', monday: 'Quiet Time/Reading', tuesday: 'Quiet Time/Reading', wednesday: 'Quiet Time/Reading', thursday: 'Quiet Time/Reading', friday: 'Quiet Time/Reading' },
  { id: '7', time: '2:00 - 3:30', monday: 'Creative Workshop', tuesday: 'Science Lab', wednesday: 'Music & Dance', thursday: 'Environmental Project', friday: 'Showcase Prep' },
  { id: '8', time: '3:30 - 4:00', monday: 'Afternoon Snack', tuesday: 'Afternoon Snack', wednesday: 'Afternoon Snack', thursday: 'Afternoon Snack', friday: 'Afternoon Snack' },
  { id: '9', time: '4:00 - 4:30', monday: 'Reflection & Departure', tuesday: 'Reflection & Departure', wednesday: 'Reflection & Departure', thursday: 'Reflection & Departure', friday: 'Reflection & Departure' }
]

export default function EditableTimetable() {
  const [activeTab, setActiveTab] = useState<'mini' | 'explorer'>('mini')
  const [miniTimetable, setMiniTimetable] = useState<TimeSlot[]>(defaultMiniTimetable)
  const [explorerTimetable, setExplorerTimetable] = useState<TimeSlot[]>(defaultExplorerTimetable)
  const [editingCell, setEditingCell] = useState<{ row: string, day: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const supabase = createClient()

  // Load timetables from database
  useEffect(() => {
    loadTimetables()
  }, [])

  const loadTimetables = async () => {
    try {
      // Load mini timetable
      const { data: miniData, error: miniError } = await supabase
        .from('camp_settings')
        .select('value')
        .eq('key', 'mini_timetable')
        .single()

      if (!miniError && miniData?.value) {
        setMiniTimetable(miniData.value)
      }

      // Load explorer timetable
      const { data: explorerData, error: explorerError } = await supabase
        .from('camp_settings')
        .select('value')
        .eq('key', 'explorer_timetable')
        .single()

      if (!explorerError && explorerData?.value) {
        setExplorerTimetable(explorerData.value)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const saveTimetable = async () => {
    setSaving(true)
    try {
      const currentTimetable = activeTab === 'mini' ? miniTimetable : explorerTimetable
      const key = activeTab === 'mini' ? 'mini_timetable' : 'explorer_timetable'
      
      const { error } = await supabase
        .from('camp_settings')
        .upsert({
          key,
          value: currentTimetable,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving timetable:', error)
        alert('Failed to save timetable')
      } else {
        setLastSaved(new Date())
        setTimeout(() => setSaving(false), 500)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save timetable')
      setSaving(false)
    }
  }

  const startEditing = (rowId: string, day: string, currentValue: string) => {
    setEditingCell({ row: rowId, day })
    setEditValue(currentValue)
  }

  const cancelEditing = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const saveCell = () => {
    if (!editingCell) return

    const currentTimetable = activeTab === 'mini' ? miniTimetable : explorerTimetable
    const updatedTimetable = currentTimetable.map(slot => {
      if (slot.id === editingCell.row) {
        return { ...slot, [editingCell.day]: editValue }
      }
      return slot
    })

    if (activeTab === 'mini') {
      setMiniTimetable(updatedTimetable)
    } else {
      setExplorerTimetable(updatedTimetable)
    }
    
    setEditingCell(null)
    setEditValue('')
  }

  const isEditing = (rowId: string, day: string) => {
    return editingCell?.row === rowId && editingCell?.day === day
  }

  const currentTimetable = activeTab === 'mini' ? miniTimetable : explorerTimetable

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h2>Summer Camp Timetables</h2>
        <div className="timetable-actions">
          {lastSaved && (
            <span className="last-saved">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button 
            className={`save-button ${saving ? 'saving' : ''}`}
            onClick={saveTimetable}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'mini' ? 'active' : ''}`}
          onClick={() => setActiveTab('mini')}
        >
          <Baby size={18} />
          Mini Camp (Ages 3-6)
        </button>
        <button
          className={`tab-button ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          <Users size={18} />
          Explorer Camp (Ages 7-13)
        </button>
      </div>

      <div className="timetable-wrapper">
        <table className="editable-timetable">
          <thead>
            <tr>
              <th className="time-header">Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            {currentTimetable.map(slot => (
              <tr key={slot.id}>
                <td className="time-cell">{slot.time}</td>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                  <td key={day} className="activity-cell">
                    {isEditing(slot.id, day) ? (
                      <div className="edit-cell">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveCell()
                            if (e.key === 'Escape') cancelEditing()
                          }}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button onClick={saveCell} className="icon-button save">
                            <Check size={14} />
                          </button>
                          <button onClick={cancelEditing} className="icon-button cancel">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="activity-content"
                        onClick={() => startEditing(slot.id, day, slot[day as keyof TimeSlot] as string)}
                      >
                        <span>{slot[day as keyof TimeSlot]}</span>
                        <Edit2 size={14} className="edit-icon" />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .timetable-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
        }

        .tab-container {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e0e0e0;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #666;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -2px;
        }

        .tab-button:hover {
          color: #333;
          background: #f5f5f5;
        }

        .tab-button.active {
          color: #2c5530;
          border-bottom-color: #2c5530;
          background: #f0f7f0;
        }

        .timetable-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .timetable-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .timetable-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .last-saved {
          font-size: 14px;
          color: #666;
        }

        .save-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #2c5530;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-button:hover {
          background: #1e3a20;
        }

        .save-button.saving {
          background: #666;
          cursor: not-allowed;
        }

        .timetable-wrapper {
          overflow-x: auto;
        }

        .editable-timetable {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .editable-timetable th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }

        .time-header {
          width: 120px;
          background: #2c5530;
          color: white;
        }

        .time-cell {
          background: #f8f9fa;
          font-weight: 500;
          color: #555;
          padding: 12px;
          border-right: 2px solid #e0e0e0;
        }

        .activity-cell {
          padding: 8px;
          border: 1px solid #e0e0e0;
          position: relative;
        }

        .activity-content {
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 36px;
          transition: background 0.2s;
        }

        .activity-content:hover {
          background: #f0f0f0;
        }

        .edit-icon {
          opacity: 0;
          transition: opacity 0.2s;
          color: #666;
        }

        .activity-content:hover .edit-icon {
          opacity: 1;
        }

        .edit-cell {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .edit-cell input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid #2c5530;
          border-radius: 4px;
          font-size: 14px;
          outline: none;
        }

        .edit-actions {
          display: flex;
          gap: 4px;
        }

        .icon-button {
          padding: 4px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .icon-button.save {
          background: #4caf50;
          color: white;
        }

        .icon-button.save:hover {
          background: #45a049;
        }

        .icon-button.cancel {
          background: #f44336;
          color: white;
        }

        .icon-button.cancel:hover {
          background: #da190b;
        }
      `}</style>
    </div>
  )
}