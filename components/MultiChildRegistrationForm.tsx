'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, Calendar, User, Phone, Mail, AlertCircle, Plus, X, Edit2 } from 'lucide-react'

const WEEKS = [
  { week: 1, dates: 'June 30 - July 4, 2025' },
  { week: 2, dates: 'July 7 - 11, 2025' },
  { week: 3, dates: 'July 14 - 18, 2025' },
  { week: 4, dates: 'July 21 - 25, 2025' },
  { week: 5, dates: 'July 28 - August 1, 2025' },
  { week: 6, dates: 'August 4 - 8, 2025' },
  { week: 7, dates: 'August 11 - 15, 2025' }
]

interface ChildData {
  id: string
  childName: string
  nickName: string
  gender: string
  dateOfBirth: string
  ageGroup: 'mini' | 'explorer'
  currentSchool: string
  nationalityLanguage: string
  englishLevel: string
  allergies: string
  healthBehavioralConditions: string
  hasInsurance: boolean
  weeksSelected: number[]
  childPassportFile?: File | null
}

interface MultiChildRegistrationFormProps {
  initialAgeGroup?: 'mini' | 'explorer'
}

export default function MultiChildRegistrationForm({ initialAgeGroup = 'explorer' }: MultiChildRegistrationFormProps) {
  // Parent information
  const [parentData, setParentData] = useState({
    email: '',
    parentName1: '',
    parentName2: '',
    mobilePhone1: '',
    wechatWhatsapp1: '',
    mobilePhone2: '',
    wechatWhatsapp2: '',
    emergencyContact: '',
    photoPermission: '',
    howDidYouFind: '',
    termsAcknowledged: false,
    allStatementsTrue: false
  })
  
  // Children array
  const [children, setChildren] = useState<ChildData[]>([])
  
  // Current child being edited/added
  const [currentChild, setCurrentChild] = useState<ChildData>({
    id: Date.now().toString(),
    childName: '',
    nickName: '',
    gender: '',
    dateOfBirth: '',
    ageGroup: initialAgeGroup,
    currentSchool: '',
    nationalityLanguage: '',
    englishLevel: '3',
    allergies: '',
    healthBehavioralConditions: '',
    hasInsurance: false,
    weeksSelected: []
  })
  
  const [showChildForm, setShowChildForm] = useState(false)
  const [editingChildId, setEditingChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleParentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setParentData(prev => ({ ...prev, [name]: checked }))
    } else {
      setParentData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setCurrentChild(prev => ({ ...prev, [name]: checked }))
    } else {
      setCurrentChild(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleWeekToggle = (weekNumber: number) => {
    setCurrentChild(prev => ({
      ...prev,
      weeksSelected: prev.weeksSelected.includes(weekNumber)
        ? prev.weeksSelected.filter(w => w !== weekNumber)
        : [...prev.weeksSelected, weekNumber]
    }))
  }
  
  const handleChildFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCurrentChild(prev => ({ ...prev, childPassportFile: file }))
    }
  }
  
  
  const addOrUpdateChild = () => {
    // Minimal validation - only essential fields
    if (!currentChild.childName) {
      setError('Please enter child name')
      return
    }
    
    if (currentChild.weeksSelected.length === 0) {
      setError('Please select at least one week')
      return
    }
    
    if (editingChildId) {
      // Update existing child
      setChildren(prev => prev.map(child => 
        child.id === editingChildId ? currentChild : child
      ))
    } else {
      // Add new child
      setChildren(prev => [...prev, currentChild])
    }
    
    // Reset form
    setCurrentChild({
      id: Date.now().toString(),
      childName: '',
      nickName: '',
      gender: '',
      dateOfBirth: '',
      ageGroup: initialAgeGroup,
      currentSchool: '',
      nationalityLanguage: '',
      englishLevel: '3',
      allergies: '',
      healthBehavioralConditions: '',
      hasInsurance: false,
      weeksSelected: []
    })
    setShowChildForm(false)
    setEditingChildId(null)
    setError('')
  }
  
  const editChild = (child: ChildData) => {
    setCurrentChild(child)
    setEditingChildId(child.id)
    setShowChildForm(true)
  }
  
  const removeChild = (childId: string) => {
    setChildren(prev => prev.filter(child => child.id !== childId))
  }
  
  const uploadFile = async (file: File, path: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('registration-documents')
      .upload(path, file)
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('registration-documents')
      .getPublicUrl(path)
    
    return publicUrl
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (children.length === 0) {
      setError('Please add at least one child')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const timestamp = Date.now()
      
      // Submit registration for each child
      for (const child of children) {
        // Upload child passport if exists
        const childPassportUrl = child.childPassportFile
          ? await uploadFile(child.childPassportFile, `${timestamp}_${child.id}_passport`)
          : null
        
        const registrationData = {
            // Required fields with defaults
            email: parentData.email || '',
            child_name: child.childName || 'Unknown',
            nick_name: child.nickName || child.childName || 'Unknown',
            gender: child.gender || 'Boy', // Default to Boy if not specified
            date_of_birth: child.dateOfBirth || '2019-01-01', // Default to ~5 years old
            age_group: child.ageGroup || 'mini',
            current_school: child.currentSchool || 'Not specified',
            nationality_language: child.nationalityLanguage || 'Thai',
            english_level: child.englishLevel || '3',
            parent_name_1: parentData.parentName1 || 'Parent',
            parent_name_2: parentData.parentName2 || '',
            mobile_phone_1: parentData.mobilePhone1 || 'Not provided',
            wechat_whatsapp_1: parentData.wechatWhatsapp1 || '',
            mobile_phone_2: parentData.mobilePhone2 || '',
            wechat_whatsapp_2: parentData.wechatWhatsapp2 || '',
            emergency_contact: parentData.emergencyContact || 'Not provided',
            allergies: child.allergies || 'None',
            health_behavioral_conditions: child.healthBehavioralConditions || 'None',
            child_passport_url: childPassportUrl,
            parent_passport_1_url: null,
            parent_passport_2_url: null,
            has_insurance: child.hasInsurance || false,
            weeks_selected: child.weeksSelected.length > 0 ? child.weeksSelected : [1], // Default to week 1
            photo_permission: parentData.photoPermission === 'grant',
            how_did_you_find: parentData.howDidYouFind || 'Not specified',
            terms_acknowledged: parentData.termsAcknowledged || false,
            all_statements_true: parentData.allStatementsTrue || false
          }
        
        console.log('Submitting registration data:', registrationData)
        
        const { error: dbError } = await supabase
          .from('registrations')
          .insert(registrationData)
        
        if (dbError) throw dbError

        // Send Telegram notification to admins (don't wait for it)
        fetch('/api/notifications/new-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            child_name: registrationData.child_name,
            email: registrationData.email,
            age_group: registrationData.age_group,
            weeks_selected: registrationData.weeks_selected,
            parent_name_1: registrationData.parent_name_1,
            created_at: new Date().toISOString()
          })
        }).catch(error => {
          console.warn('Failed to send admin notification:', error)
        })
      }
      
      setSuccess(true)
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="success-message">
        <h2>Registration Successful!</h2>
        <p>Thank you for registering for Summer Camp 2025. We have received registrations for:</p>
        <ul className="registered-children-list">
          {children.map(child => (
            <li key={child.id}>
              {child.childName} - {child.ageGroup === 'mini' ? 'Mini Camp' : 'Explorer Camp'} 
              - Weeks: {child.weeksSelected.join(', ')}
            </li>
          ))}
        </ul>
        <p>We will send you an email with payment instructions shortly.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="submit-button"
          style={{ marginTop: '30px' }}
        >
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <div className="form-info">
        <div className="pricing-info">
          <h3>Weekly Fee Per Child</h3>
          <div className="price-item">
            <strong>Early Bird (by April 15, 2025):</strong> 13,000 baht
          </div>
          <div className="price-item">
            <strong>Regular (after April 15, 2025):</strong> 15,000 baht
          </div>
        </div>
        
        <div className="terms-link">
          <a href="https://docs.google.com/document/d/1xTQy-ptHGNuBc3TNmCF54ZdkB9BOeLm0dzSNmVv-aws/edit?usp=sharing" 
             target="_blank" 
             rel="noopener noreferrer">
            Read Terms and Conditions
          </a>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Parent Information Section */}
      <div className="form-section">
        <h3>Parent/Guardian Information</h3>
        
        <div className="form-group">
          <label>
            Email *
            <input
              type="email"
              name="email"
              value={parentData.email}
              onChange={handleParentInputChange}
              required
            />
          </label>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              Parent Name 1 *
              <input
                type="text"
                name="parentName1"
                value={parentData.parentName1}
                onChange={handleParentInputChange}
                // required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Parent Name 2 *
              <input
                type="text"
                name="parentName2"
                value={parentData.parentName2}
                onChange={handleParentInputChange}
                // required
              />
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Mobile Phone 1 * (Thai number if available)
              <input
                type="tel"
                name="mobilePhone1"
                value={parentData.mobilePhone1}
                onChange={handleParentInputChange}
                // required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              WeChat/WhatsApp ID 1 *
              <input
                type="text"
                name="wechatWhatsapp1"
                value={parentData.wechatWhatsapp1}
                onChange={handleParentInputChange}
                // required
              />
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Mobile Phone 2 * (Thai number if available)
              <input
                type="tel"
                name="mobilePhone2"
                value={parentData.mobilePhone2}
                onChange={handleParentInputChange}
                // required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              WeChat/WhatsApp ID 2 *
              <input
                type="text"
                name="wechatWhatsapp2"
                value={parentData.wechatWhatsapp2}
                onChange={handleParentInputChange}
                // required
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>
            Emergency Contact * (Name and Thai phone number)
            <input
              type="text"
              name="emergencyContact"
              value={parentData.emergencyContact}
              onChange={handleParentInputChange}
              // required
            />
          </label>
        </div>
      </div>

      {/* Children Section */}
      <div className="form-section">
        <h3>Children Information</h3>
        
        {/* List of added children */}
        {children.length > 0 && (
          <div className="children-list">
            {children.map(child => (
              <div key={child.id} className="child-card">
                <div className="child-card-header">
                  <h4>{child.childName} ({child.nickName})</h4>
                  <div className="child-card-actions">
                    <button
                      type="button"
                      onClick={() => editChild(child)}
                      className="icon-btn"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="icon-btn delete"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="child-card-details">
                  <p><strong>Camp:</strong> {child.ageGroup === 'mini' ? 'Mini (3-6)' : 'Explorer (7-13)'}</p>
                  <p><strong>Weeks:</strong> {child.weeksSelected.join(', ')}</p>
                  <p><strong>DOB:</strong> {child.dateOfBirth}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add Child Button or Form */}
        {!showChildForm ? (
          <button
            type="button"
            onClick={() => setShowChildForm(true)}
            className="add-child-btn"
          >
            <Plus size={20} />
            Add Child
          </button>
        ) : (
          <div className="child-form-container">
            <h4>{editingChildId ? 'Edit Child' : 'Add Child'}</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Child Name *
                  <input
                    type="text"
                    name="childName"
                    value={currentChild.childName}
                    onChange={handleChildInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Nick Name *
                  <input
                    type="text"
                    name="nickName"
                    value={currentChild.nickName}
                    onChange={handleChildInputChange}
                  />
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Camp Type *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="ageGroup"
                      value="mini"
                      checked={currentChild.ageGroup === 'mini'}
                      onChange={() => setCurrentChild(prev => ({ ...prev, ageGroup: 'mini' }))}
                    />
                    Mini Camp (3-6 years)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ageGroup"
                      value="explorer"
                      checked={currentChild.ageGroup === 'explorer'}
                      onChange={() => setCurrentChild(prev => ({ ...prev, ageGroup: 'explorer' }))}
                    />
                    Explorer Camp (7-13 years)
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Girl"
                      checked={currentChild.gender === 'Girl'}
                      onChange={handleChildInputChange}
                    />
                    Girl
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Boy"
                      checked={currentChild.gender === 'Boy'}
                      onChange={handleChildInputChange}
                    />
                    Boy
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>
                  Date of Birth *
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={currentChild.dateOfBirth}
                    onChange={handleChildInputChange}
                  />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>
                Child's Passport Copy
                <div className="file-input">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChildFileChange}
                  />
                  <Upload size={20} />
                  <span>{currentChild.childPassportFile?.name || 'Choose file (optional)'}</span>
                </div>
              </label>
            </div>

            <div className="form-section">
              <h5>Select Weeks *</h5>
              <div className="weeks-grid">
                {WEEKS.map(week => (
                  <label key={week.week} className="week-option">
                    <input
                      type="checkbox"
                      checked={currentChild.weeksSelected.includes(week.week)}
                      onChange={() => handleWeekToggle(week.week)}
                    />
                    <span>Week {week.week}: {week.dates}</span>
                  </label>
                ))}
              </div>
            </div>


            <div className="form-layout-special">
              <div className="form-fields-left">
                <div className="form-group">
                  <label>
                    Nationality and Language *
                    <input
                      type="text"
                      name="nationalityLanguage"
                      value={currentChild.nationalityLanguage}
                      onChange={handleChildInputChange}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Current School *
                    <input
                      type="text"
                      name="currentSchool"
                      value={currentChild.currentSchool}
                      onChange={handleChildInputChange}
                    />
                  </label>
                </div>
              </div>
              <div className="form-group english-level-group">
                <label>
                  Child's Level of English
                  <div className="english-level-container">
                    <input
                      type="range"
                      name="englishLevel"
                      min="1"
                      max="5"
                      value={currentChild.englishLevel}
                      onChange={handleChildInputChange}
                      className="english-level-slider"
                    />
                    <div className="english-level-labels">
                      <span>1<br/><small>Beginner</small></span>
                      <span>2<br/><small>Basic</small></span>
                      <span>3<br/><small>Intermediate</small></span>
                      <span>4<br/><small>Good</small></span>
                      <span>5<br/><small>Fluent</small></span>
                    </div>
                    <div className="english-level-value">
                      Level: {currentChild.englishLevel}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>
                Child's Allergies (if any) *
                <textarea
                  name="allergies"
                  value={currentChild.allergies}
                  onChange={handleChildInputChange}
                  rows={3}
                  placeholder="None"
                />
              </label>
            </div>
            
            <div className="form-group">
              <label>
                Health or Behavioral Conditions *
                <textarea
                  name="healthBehavioralConditions"
                  value={currentChild.healthBehavioralConditions}
                  onChange={handleChildInputChange}
                  rows={3}
                  placeholder="None"
                />
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasInsurance"
                  checked={currentChild.hasInsurance}
                  onChange={handleChildInputChange}
                />
                <span>
                  I confirm that my child has valid insurance coverage for the duration of the camp *
                </span>
              </label>
            </div>

            <div className="child-form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowChildForm(false)
                  setEditingChildId(null)
                  setCurrentChild({
                    id: Date.now().toString(),
                    childName: '',
                    nickName: '',
                    gender: '',
                    dateOfBirth: '',
                    ageGroup: initialAgeGroup,
                    currentSchool: '',
                    nationalityLanguage: '',
                    englishLevel: '3',
                    allergies: '',
                    healthBehavioralConditions: '',
                    hasInsurance: false,
                    weeksSelected: []
                  })
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addOrUpdateChild}
                className="save-child-btn"
              >
                {editingChildId ? 'Update Child' : 'Save Child'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="form-section">
        <h3>Additional Information</h3>
        <div className="form-group">
          <label>Photo/Video Permission *</label>
          <div className="permission-info">
            Our school likes to celebrate your child's work and achievements. 
            Images may appear in printed publications, electronic presentations, 
            on our website, and social media.
          </div>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="photoPermission"
                value="grant"
                checked={parentData.photoPermission === 'grant'}
                onChange={handleParentInputChange}
                // required
              />
              Grant permission
            </label>
            <label>
              <input
                type="radio"
                name="photoPermission"
                value="deny"
                checked={parentData.photoPermission === 'deny'}
                onChange={handleParentInputChange}
                // required
              />
              Do not grant permission
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>
            How did you find out about us? *
            <input
              type="text"
              name="howDidYouFind"
              value={parentData.howDidYouFind}
              onChange={handleParentInputChange}
              placeholder="Please specify"
              // required
            />
          </label>
        </div>
      </div>

      <div className="form-section acknowledgment">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="termsAcknowledged"
            checked={parentData.termsAcknowledged}
            onChange={handleParentInputChange}
            // required
          />
          <span>
            I acknowledge that I have read and understood the terms and conditions 
            of the Waldorf Phuket Summer Camp, and I understand that the Waldorf 
            Phuket does not provide insurance for participants. *
          </span>
        </label>
        
        <label className="checkbox-label" style={{ marginTop: '15px' }}>
          <input
            type="checkbox"
            name="allStatementsTrue"
            checked={parentData.allStatementsTrue}
            onChange={handleParentInputChange}
            // required
          />
          <span>
            I confirm that all information provided above is true and accurate to the best of my knowledge. *
          </span>
        </label>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading || children.length === 0}
      >
        {loading ? 'Submitting...' : `Submit Registration for ${children.length} Child${children.length !== 1 ? 'ren' : ''}`}
      </button>
    </form>
  )
}