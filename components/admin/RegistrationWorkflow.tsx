'use client'

import { useState, useEffect } from 'react'
import { 
  Check, 
  Clock, 
  DollarSign, 
  Mail, 
  Eye, 
  Trash2, 
  MoreVertical, 
  Send,
  CreditCard,
  X,
  AlertCircle,
  ChevronRight
} from 'lucide-react'
import './RegistrationWorkflow.css'

interface Registration {
  id: string
  child_name: string
  nick_name?: string
  parent_name_1: string
  parent_name_2?: string
  email: string
  mobile_phone_1: string
  mobile_phone_2?: string
  age_group: 'mini' | 'explorer'
  weeks_selected: number[]
  created_at: string
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded'
  payment_amount?: number
  payment_date?: string
  payment_method?: string
  payment_reference?: string
  payment_request_sent?: string
  confirmation_email_sent?: string
  admin_notes?: string
}

interface WorkflowStats {
  new: number
  awaiting_payment: number
  paid: number
  confirmed: number
}

export default function RegistrationWorkflow() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllActive, setShowAllActive] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [stats, setStats] = useState<WorkflowStats>({
    new: 0,
    awaiting_payment: 0,
    paid: 0,
    confirmed: 0
  })
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [paymentForm, setPaymentForm] = useState({
    status: 'paid',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: '',
    reference: '',
    notes: ''
  })

  useEffect(() => {
    loadRegistrations()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target || !(event.target as Element).closest('.action-dropdown')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const loadRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations')
      if (response.ok) {
        const { registrations: data } = await response.json()
        setRegistrations(data || [])
        calculateStats(data || [])
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions to categorize registrations
  const getActiveRegistrations = (regs: Registration[]) => {
    return regs.filter(reg => !reg.confirmation_email_sent && !reg.admin_notes?.includes('archived'))
  }

  const getCompletedRegistrations = (regs: Registration[]) => {
    return regs.filter(reg => reg.confirmation_email_sent && !reg.admin_notes?.includes('archived'))
  }

  const getArchivedRegistrations = (regs: Registration[]) => {
    return regs.filter(reg => reg.admin_notes?.includes('archived'))
  }

  const calculateStats = (regs: Registration[]) => {
    const activeRegs = getActiveRegistrations(regs)
    const newStats = {
      new: 0,
      awaiting_payment: 0,
      paid: 0,
      confirmed: getCompletedRegistrations(regs).length
    }

    activeRegs.forEach(reg => {
      if (!reg.payment_request_sent) {
        newStats.new++
      } else if (reg.payment_status === 'pending') {
        newStats.awaiting_payment++
      } else if (reg.payment_status === 'paid' && !reg.confirmation_email_sent) {
        newStats.paid++
      }
    })

    setStats(newStats)
  }

  const getRegistrationStatus = (reg: Registration) => {
    if (reg.confirmation_email_sent) {
      return { label: 'Complete', className: 'status-complete', icon: '✅' }
    } else if (reg.payment_status === 'paid') {
      return { label: 'Paid', className: 'status-paid', icon: '✅' }
    } else if (reg.payment_request_sent) {
      return { label: 'Pending Payment', className: 'status-payment-pending', icon: '💰' }
    } else {
      return { label: 'New', className: 'status-new', icon: '📝' }
    }
  }

  const getProgressDots = (reg: Registration) => {
    const dots = []
    const isNew = !reg.payment_request_sent
    const requestSent = !!reg.payment_request_sent
    const isPaid = reg.payment_status === 'paid'
    const isConfirmed = !!reg.confirmation_email_sent

    // Registration received
    dots.push(isNew ? 'active' : 'completed')
    
    // Payment request sent
    dots.push(requestSent && !isPaid ? 'active' : requestSent ? 'completed' : '')
    
    // Payment received
    dots.push(isPaid && !isConfirmed ? 'active' : isPaid ? 'completed' : '')
    
    // Confirmation sent
    dots.push(isConfirmed ? 'completed' : '')

    return dots
  }

  const calculatePrice = (reg: Registration) => {
    const pricePerWeek = 5000
    return reg.weeks_selected.length * pricePerWeek
  }

  const sendPaymentRequest = async (reg: Registration) => {
    try {
      const response = await fetch(`/api/admin/registrations/${reg.id}/payment-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: calculatePrice(reg),
          email: reg.email 
        })
      })

      if (response.ok) {
        // Update local state
        const updatedRegs = registrations.map(r => 
          r.id === reg.id 
            ? { ...r, payment_request_sent: new Date().toISOString() }
            : r
        )
        setRegistrations(updatedRegs)
        calculateStats(updatedRegs)
      }
    } catch (error) {
      console.error('Error sending payment request:', error)
      alert('Failed to send payment request')
    }
  }

  const sendConfirmation = async (reg: Registration) => {
    try {
      const response = await fetch(`/api/admin/registrations/${reg.id}/confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: reg.email })
      })

      if (response.ok) {
        // Update local state
        const updatedRegs = registrations.map(r => 
          r.id === reg.id 
            ? { ...r, confirmation_email_sent: new Date().toISOString() }
            : r
        )
        setRegistrations(updatedRegs)
        calculateStats(updatedRegs)
      }
    } catch (error) {
      console.error('Error sending confirmation:', error)
      alert('Failed to send confirmation')
    }
  }

  const recordPayment = async () => {
    if (!selectedRegistration) return

    try {
      const response = await fetch(`/api/admin/registrations/${selectedRegistration.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: paymentForm.status,
          payment_amount: parseFloat(paymentForm.amount.replace(/[^0-9.-]+/g, '')),
          payment_date: paymentForm.date,
          payment_method: paymentForm.method,
          payment_reference: paymentForm.reference,
          admin_notes: paymentForm.notes
        })
      })

      if (response.ok) {
        // Update local state
        const updatedRegs = registrations.map(r => 
          r.id === selectedRegistration.id 
            ? { 
                ...r, 
                payment_status: paymentForm.status as any,
                payment_amount: parseFloat(paymentForm.amount.replace(/[^0-9.-]+/g, '')),
                payment_date: paymentForm.date,
                payment_method: paymentForm.method,
                payment_reference: paymentForm.reference
              }
            : r
        )
        setRegistrations(updatedRegs)
        calculateStats(updatedRegs)
        setShowPaymentModal(false)
        resetPaymentForm()
      }
    } catch (error) {
      console.error('Error recording payment:', error)
      alert('Failed to record payment')
    }
  }

  const resetPaymentForm = () => {
    setPaymentForm({
      status: 'paid',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: '',
      reference: '',
      notes: ''
    })
    setSelectedRegistration(null)
  }

  const archiveRegistration = async (id: string) => {
    if (!confirm('Archive this registration as abandoned/cancelled?\n\nThis will move it out of the active workflow.')) return

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          admin_notes: 'archived',
          archived_at: new Date().toISOString()
        })
      })

      if (response.ok) {
        // Update local state
        const updatedRegs = registrations.map(r => 
          r.id === id 
            ? { ...r, admin_notes: 'archived' }
            : r
        )
        setRegistrations(updatedRegs)
        calculateStats(updatedRegs)
      }
    } catch (error) {
      console.error('Error archiving registration:', error)
      alert('Failed to archive registration')
    }
  }

  const unarchiveRegistration = async (id: string) => {
    if (!confirm('Unarchive this registration?\n\nThis will move it back to the active workflow.')) return

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          admin_notes: '',
          archived_at: null
        })
      })

      if (response.ok) {
        // Update local state
        const updatedRegs = registrations.map(r => 
          r.id === id 
            ? { ...r, admin_notes: '' }
            : r
        )
        setRegistrations(updatedRegs)
        calculateStats(updatedRegs)
      }
    } catch (error) {
      console.error('Error unarchiving registration:', error)
      alert('Failed to unarchive registration')
    }
  }

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const updatedRegs = registrations.filter(r => r.id !== id)
        setRegistrations(updatedRegs)
        calculateStats(updatedRegs)
      }
    } catch (error) {
      console.error('Error deleting registration:', error)
      alert('Failed to delete registration')
    }
  }

  if (loading) {
    return (
      <div className="workflow-loading">
        <div className="spinner"></div>
        <p>Loading workflow...</p>
      </div>
    )
  }

  return (
    <div className="registration-workflow">
      <div className="workflow-header">
        <h2>Registration Workflow</h2>
        <p>Track each registration through the complete process</p>
      </div>


      {/* Quick Stats */}
      <div className="workflow-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.new}</div>
          <div className="stat-label">New Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.awaiting_payment}</div>
          <div className="stat-label">Awaiting Payment</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.paid}</div>
          <div className="stat-label">Paid</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="workflow-links">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? 'Hide' : 'Show'} Completed ({getCompletedRegistrations(registrations).length})
        </button>
        {getArchivedRegistrations(registrations).length > 0 && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? 'Hide' : 'Show'} Archived ({getArchivedRegistrations(registrations).length})
          </button>
        )}
      </div>

      {/* Completed Section */}
      {showCompleted && (
        <div className="workflow-table-section">
          <div className="section-header">
            <h3>Completed Registrations</h3>
            <p>Registrations that have been fully processed</p>
          </div>
          
          <table className="workflow-table completed-table">
            <thead>
              <tr>
                <th>Registration Info</th>
                <th>Status</th>
                <th>Completed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCompletedRegistrations(registrations).map((reg) => {
                const expectedAmount = calculatePrice(reg)
                return (
                  <tr key={reg.id}>
                    <td>
                      <div className="registration-info">
                        <div className="child-name">{reg.child_name}</div>
                        <div className="parent-name">
                          {reg.parent_name_1} • {reg.mobile_phone_1}
                        </div>
                        <div className="camp-details">
                          {reg.age_group === 'mini' ? 'Mini Camp' : 'Explorer Camp'} • 
                          Weeks {reg.weeks_selected.join(', ')} • 
                          ฿{expectedAmount.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-complete">
                        ✅ Complete
                      </span>
                    </td>
                    <td>
                      {reg.confirmation_email_sent && new Date(reg.confirmation_email_sent).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => {
                            setSelectedRegistration(reg)
                            setShowDetailsModal(true)
                          }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Archived Section */}
      {showArchived && getArchivedRegistrations(registrations).length > 0 && (
        <div className="workflow-table-section">
          <div className="section-header">
            <h3>Archived Registrations</h3>
            <p>Registrations that were abandoned or cancelled</p>
          </div>
          
          <table className="workflow-table archived-table">
            <thead>
              <tr>
                <th>Registration Info</th>
                <th>Status</th>
                <th>Archived Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getArchivedRegistrations(registrations).map((reg) => {
                const expectedAmount = calculatePrice(reg)
                return (
                  <tr key={reg.id}>
                    <td>
                      <div className="registration-info">
                        <div className="child-name">{reg.child_name}</div>
                        <div className="parent-name">
                          {reg.parent_name_1} • {reg.mobile_phone_1}
                        </div>
                        <div className="camp-details">
                          {reg.age_group === 'mini' ? 'Mini Camp' : 'Explorer Camp'} • 
                          Weeks {reg.weeks_selected.join(', ')} • 
                          ฿{expectedAmount.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-archived">
                        📦 Archived
                      </span>
                    </td>
                    <td>
                      Date archived
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => {
                            setSelectedRegistration(reg)
                            setShowDetailsModal(true)
                          }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn unarchive"
                          onClick={() => unarchiveRegistration(reg.id)}
                          title="Unarchive"
                        >
                          <span>↩️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Active Workflow Section */}
      <div className="workflow-table-section">
        <div className="section-header">
          <h3>Active Workflow</h3>
          <p>Registrations requiring action</p>
        </div>
        
        {(() => {
          const activeRegs = getActiveRegistrations(registrations)
          const displayRegs = showAllActive ? activeRegs : activeRegs.slice(0, 10)
          
          return (
            <>
              <table className="workflow-table">
                <thead>
                  <tr>
                    <th>Registration Info</th>
                    <th>Payment Request</th>
                    <th>Payment Status</th>
                    <th>Confirmation</th>
                    <th>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRegs.map((reg) => {
                    const status = getRegistrationStatus(reg)
                    const progressDots = getProgressDots(reg)
                    const expectedAmount = calculatePrice(reg)

                    return (
                      <tr key={reg.id}>
                        <td>
                          <div className="registration-info">
                            <div className="child-name">{reg.child_name}</div>
                            <div className="parent-name">
                              {reg.parent_name_1} • {reg.mobile_phone_1}
                            </div>
                            <div className="camp-details">
                              {reg.age_group === 'mini' ? 'Mini Camp' : 'Explorer Camp'} • 
                              Weeks {reg.weeks_selected.join(', ')} • 
                              ฿{expectedAmount.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td>
                          {!reg.payment_request_sent ? (
                            <div className="status-cell">
                              <input
                                type="checkbox"
                                className="checkbox-action"
                                onChange={() => sendPaymentRequest(reg)}
                              />
                              <label>Send request</label>
                            </div>
                          ) : (
                            <div className="status-cell">
                              <span className="status-completed">
                                ✓ Sent {new Date(reg.payment_request_sent).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </td>
                        <td>
                          {reg.payment_status === 'paid' ? (
                            <span className="status-badge status-paid">
                              ✅ Paid {reg.payment_amount && `(฿${reg.payment_amount.toLocaleString()})`}
                            </span>
                          ) : reg.payment_request_sent ? (
                            <span 
                              className="status-badge status-payment-pending"
                              onClick={() => {
                                setSelectedRegistration(reg)
                                setPaymentForm({
                                  ...paymentForm,
                                  amount: `฿${expectedAmount}`
                                })
                                setShowPaymentModal(true)
                              }}
                            >
                              💰 Pending Payment
                            </span>
                          ) : (
                            <span className="status-badge status-new">
                              {status.icon} {status.label}
                            </span>
                          )}
                        </td>
                        <td>
                          {reg.confirmation_email_sent ? (
                            <div className="status-cell">
                              <span className="status-completed">
                                ✓ Sent {new Date(reg.confirmation_email_sent).toLocaleDateString()}
                              </span>
                            </div>
                          ) : reg.payment_status === 'paid' ? (
                            <div className="status-cell">
                              <input
                                type="checkbox"
                                className="checkbox-action"
                                onChange={() => sendConfirmation(reg)}
                              />
                              <label>Send confirmation</label>
                            </div>
                          ) : (
                            <div className="status-cell">
                              <input type="checkbox" disabled className="checkbox-action" />
                              <label className="disabled">
                                {reg.payment_request_sent ? 'Awaiting payment' : 'Not ready'}
                              </label>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="progress-dots">
                            {progressDots.map((dot, i) => (
                              <div key={i} className={`dot ${dot}`}></div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => {
                                setSelectedRegistration(reg)
                                setShowDetailsModal(true)
                              }}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => deleteRegistration(reg.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="action-dropdown">
                              <button
                                className="action-btn"
                                onClick={() => setOpenMenuId(openMenuId === reg.id ? null : reg.id)}
                                title="More Actions"
                              >
                                <MoreVertical size={16} />
                              </button>
                              <div className={`dropdown-menu ${openMenuId === reg.id ? 'active' : ''}`}>
                                <button className="dropdown-item">
                                  <Mail size={14} />
                                  Send Email
                                </button>
                                <button className="dropdown-item">
                                  <Send size={14} />
                                  Send WhatsApp
                                </button>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => {
                                    archiveRegistration(reg.id)
                                    setOpenMenuId(null)
                                  }}
                                >
                                  <span>📦</span>
                                  Archive (Abandoned)
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {activeRegs.length === 0 && (
                <div className="no-registrations">
                  <AlertCircle size={48} />
                  <p>No active registrations</p>
                </div>
              )}

              {activeRegs.length > 10 && (
                <div className="expand-section">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowAllActive(!showAllActive)}
                  >
                    {showAllActive ? 'Show Less' : `Show All ${activeRegs.length} Active Registrations`}
                  </button>
                </div>
              )}
            </>
          )
        })()}
      </div>


      {/* Payment Modal */}
      {showPaymentModal && selectedRegistration && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Record Payment</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="payment-info">
              <div className="payment-child">{selectedRegistration.child_name}</div>
              <div className="payment-details">
                {selectedRegistration.age_group === 'mini' ? 'Mini Camp' : 'Explorer Camp'} • 
                Weeks {selectedRegistration.weeks_selected.join(', ')}
              </div>
              <div className="payment-expected">
                Expected: ฿{calculatePrice(selectedRegistration).toLocaleString()}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); recordPayment() }}>
              <div className="form-group">
                <label>Payment Status *</label>
                <select
                  value={paymentForm.status}
                  onChange={(e) => setPaymentForm({...paymentForm, status: e.target.value})}
                  required
                >
                  <option value="paid">Full Payment Received</option>
                  <option value="partial">Partial Payment</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount Received *</label>
                  <input
                    type="text"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    placeholder="฿5,000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Date *</label>
                  <input
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                  required
                >
                  <option value="">Select method...</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="promptpay">PromptPay</option>
                </select>
              </div>

              <div className="form-group">
                <label>Transaction Reference</label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                  placeholder="e.g., Transfer ref #12345"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  rows={3}
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CreditCard size={16} />
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRegistration && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content registration-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registration Details</h2>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="details-section">
                <h3>Child Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Full Name:</label>
                    <span>{selectedRegistration.child_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nickname:</label>
                    <span>{selectedRegistration.nick_name || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Gender:</label>
                    <span>{selectedRegistration.gender || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date of Birth:</label>
                    <span>{selectedRegistration.date_of_birth || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Age Group:</label>
                    <span>{selectedRegistration.age_group === 'mini' ? 'Mini Camp (3-6)' : 'Explorer Camp (7-13)'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Current School:</label>
                    <span>{selectedRegistration.current_school || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nationality/Language:</label>
                    <span>{selectedRegistration.nationality_language || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>English Level:</label>
                    <span>{selectedRegistration.english_level || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Parent Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Parent 1 Name:</label>
                    <span>{selectedRegistration.parent_name_1}</span>
                  </div>
                  <div className="detail-item">
                    <label>Parent 2 Name:</label>
                    <span>{selectedRegistration.parent_name_2 || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedRegistration.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mobile Phone 1:</label>
                    <span>{selectedRegistration.mobile_phone_1 || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mobile Phone 2:</label>
                    <span>{selectedRegistration.mobile_phone_2 || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>WeChat/WhatsApp 1:</label>
                    <span>{selectedRegistration.wechat_whatsapp_1 || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>WeChat/WhatsApp 2:</label>
                    <span>{selectedRegistration.wechat_whatsapp_2 || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Emergency Contact:</label>
                    <span>{selectedRegistration.emergency_contact || 'Same as parent'}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Camp Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Weeks Selected:</label>
                    <span>Week {selectedRegistration.weeks_selected?.join(', Week ') || 'None'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Price:</label>
                    <span>฿{calculatePrice(selectedRegistration).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Registration Date:</label>
                    <span>{new Date(selectedRegistration.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Health & Safety</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Allergies:</label>
                    <span>{selectedRegistration.allergies || 'None'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Health/Behavioral Conditions:</label>
                    <span>{selectedRegistration.health_behavioral_conditions || 'None'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Has Insurance:</label>
                    <span>{selectedRegistration.has_insurance ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Photo Permission:</label>
                    <span>{selectedRegistration.photo_permission ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Payment Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Payment Status:</label>
                    <span className={`status-badge ${selectedRegistration.payment_status === 'paid' ? 'status-paid' : 'status-payment-pending'}`}>
                      {selectedRegistration.payment_status || 'Pending'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Amount Paid:</label>
                    <span>{selectedRegistration.payment_amount ? `฿${selectedRegistration.payment_amount.toLocaleString()}` : 'Not paid'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Date:</label>
                    <span>{selectedRegistration.payment_date ? new Date(selectedRegistration.payment_date).toLocaleDateString() : 'Not paid'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Method:</label>
                    <span>{selectedRegistration.payment_method || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Reference:</label>
                    <span>{selectedRegistration.payment_reference || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Workflow Status</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Payment Request Sent:</label>
                    <span>{selectedRegistration.payment_request_sent ? new Date(selectedRegistration.payment_request_sent).toLocaleDateString() : 'Not sent'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Confirmation Email Sent:</label>
                    <span>{selectedRegistration.confirmation_email_sent ? new Date(selectedRegistration.confirmation_email_sent).toLocaleDateString() : 'Not sent'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Admin Notes:</label>
                    <span>{selectedRegistration.admin_notes || 'None'}</span>
                  </div>
                </div>
              </div>

              {(selectedRegistration.child_passport_url || selectedRegistration.parent_passport_1_url || selectedRegistration.parent_passport_2_url) && (
                <div className="details-section">
                  <h3>Documents</h3>
                  <div className="document-links">
                    {selectedRegistration.child_passport_url && (
                      <a href={selectedRegistration.child_passport_url} target="_blank" rel="noopener noreferrer" className="document-link">
                        📄 Child Passport
                      </a>
                    )}
                    {selectedRegistration.parent_passport_1_url && (
                      <a href={selectedRegistration.parent_passport_1_url} target="_blank" rel="noopener noreferrer" className="document-link">
                        📄 Parent 1 Passport
                      </a>
                    )}
                    {selectedRegistration.parent_passport_2_url && (
                      <a href={selectedRegistration.parent_passport_2_url} target="_blank" rel="noopener noreferrer" className="document-link">
                        📄 Parent 2 Passport
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}