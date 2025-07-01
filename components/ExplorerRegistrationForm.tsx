'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, Calendar, User, Phone, Mail, AlertCircle } from 'lucide-react'

const WEEKS = [
  { week: 1, dates: 'June 30 - July 4, 2025' },
  { week: 2, dates: 'July 7 - 11, 2025' },
  { week: 3, dates: 'July 14 - 18, 2025' },
  { week: 4, dates: 'July 21 - 25, 2025' },
  { week: 5, dates: 'July 28 - August 1, 2025' },
  { week: 6, dates: 'August 4 - 8, 2025' },
  { week: 7, dates: 'August 11 - 15, 2025' }
]

interface ExplorerRegistrationFormProps {
  ageGroup?: 'mini' | 'explorer'
}

interface ChildData {
  childName: string
  nickName: string
  gender: string
  dateOfBirth: string
  currentSchool: string
  nationalityLanguage: string
  englishLevel: string
  allergies: string
  healthBehavioralConditions: string
  hasInsurance: boolean
  childPassportFile?: File | null
  weeksSelected: number[]
}

export default function ExplorerRegistrationForm({ ageGroup = 'explorer' }: ExplorerRegistrationFormProps) {
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
  
  // Children information
  const [children, setChildren] = useState<ChildData[]>([])
  const [currentChild, setCurrentChild] = useState<ChildData>({
    childName: '',
    nickName: '',
    gender: '',
    dateOfBirth: '',
    currentSchool: '',
    nationalityLanguage: '',
    englishLevel: '3',
    allergies: '',
    healthBehavioralConditions: '',
    hasInsurance: false,
    weeksSelected: []
  })
  
  const [currentChildIndex, setCurrentChildIndex] = useState<number | null>(null)

  const [files, setFiles] = useState({
    childPassport: null as File | null,
    parentPassport1: null as File | null,
    parentPassport2: null as File | null
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleWeekToggle = (weekNumber: number) => {
    setFormData(prev => ({
      ...prev,
      weeksSelected: prev.weeksSelected.includes(weekNumber)
        ? prev.weeksSelected.filter(w => w !== weekNumber)
        : [...prev.weeksSelected, weekNumber]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof typeof files) => {
    const file = e.target.files?.[0]
    if (file) {
      setFiles(prev => ({ ...prev, [fileType]: file }))
    }
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
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Upload files
      const timestamp = Date.now()
      const childPassportUrl = files.childPassport 
        ? await uploadFile(files.childPassport, `${timestamp}_child_passport`)
        : null
      const parentPassport1Url = files.parentPassport1
        ? await uploadFile(files.parentPassport1, `${timestamp}_parent1_passport`)
        : null
      const parentPassport2Url = files.parentPassport2
        ? await uploadFile(files.parentPassport2, `${timestamp}_parent2_passport`)
        : null

      // Insert registration data
      const { error: dbError } = await supabase
        .from('registrations')
        .insert({
          email: formData.email,
          child_name: formData.childName,
          nick_name: formData.nickName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          age_group: ageGroup,
          current_school: formData.currentSchool,
          nationality_language: formData.nationalityLanguage,
          english_level: formData.englishLevel,
          parent_name_1: formData.parentName1,
          parent_name_2: formData.parentName2,
          mobile_phone_1: formData.mobilePhone1,
          wechat_whatsapp_1: formData.wechatWhatsapp1,
          mobile_phone_2: formData.mobilePhone2,
          wechat_whatsapp_2: formData.wechatWhatsapp2,
          emergency_contact: formData.emergencyContact,
          allergies: formData.allergies,
          health_behavioral_conditions: formData.healthBehavioralConditions,
          child_passport_url: childPassportUrl,
          parent_passport_1_url: parentPassport1Url,
          parent_passport_2_url: parentPassport2Url,
          has_insurance: formData.hasInsurance,
          weeks_selected: formData.weeksSelected,
          photo_permission: formData.photoPermission === 'grant',
          how_did_you_find: formData.howDidYouFind,
          terms_acknowledged: formData.termsAcknowledged,
          all_statements_true: formData.allStatementsTrue
        })

      if (dbError) throw dbError

      // Add child to registered list
      setRegisteredChildren(prev => [...prev, formData.childName])
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const [registeredChildren, setRegisteredChildren] = useState<string[]>([])

  const handleAddAnotherChild = () => {
    // Keep parent info but reset child-specific fields
    setFormData(prev => ({
      ...prev,
      childName: '',
      nickName: '',
      gender: '',
      dateOfBirth: '',
      currentSchool: '',
      nationalityLanguage: '',
      englishLevel: '3',
      allergies: '',
      healthBehavioralConditions: '',
      hasInsurance: false,
      photoPermission: '',
      weeksSelected: [],
      allStatementsTrue: false,
      termsAcknowledged: false
    }))
    setFiles({
      childPassport: null,
      parentPassport1: null,
      parentPassport2: null
    })
    setSuccess(false)
    setError('')
  }

  if (success) {
    return (
      <div className="success-message">
        <h2>Registration Successful!</h2>
        <p>Thank you for registering {formData.childName} for Summer Camp 2025.</p>
        <p>We will send you an email with payment instructions shortly.</p>
        
        {registeredChildren.length > 0 && (
          <div className="registered-children">
            <h3>Registered Children:</h3>
            <ul>
              {registeredChildren.map((child, index) => (
                <li key={index}>{child}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="success-actions">
          <button 
            onClick={handleAddAnotherChild}
            className="action-btn secondary"
          >
            Add Another Child
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="action-btn primary"
          >
            Return to Home
          </button>
        </div>
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

      <div className="form-section">
        <h3>Contact Information</h3>
        <div className="form-group">
          <label>
            Email *
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Child Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>
              Child Name *
              <input
                type="text"
                name="childName"
                value={formData.childName}
                onChange={handleInputChange}
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
                value={formData.nickName}
                onChange={handleInputChange}
                required
              />
            </label>
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
                  checked={formData.gender === 'Girl'}
                  onChange={handleInputChange}
                  required
                />
                Girl
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Boy"
                  checked={formData.gender === 'Boy'}
                  onChange={handleInputChange}
                  required
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
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>
            Child's Passport Copy *
            <div className="file-input">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'childPassport')}
                required
              />
              <Upload size={20} />
              <span>{files.childPassport?.name || 'Choose file (Max 10MB)'}</span>
            </div>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Select Weeks *</h3>
        <div className="weeks-grid">
          {WEEKS.map(week => (
            <label key={week.week} className="week-option">
              <input
                type="checkbox"
                checked={formData.weeksSelected.includes(week.week)}
                onChange={() => handleWeekToggle(week.week)}
              />
              <span>Week {week.week}: {week.dates}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>School Information</h3>
        <div className="form-group">
          <label>
            Current School *
            <input
              type="text"
              name="currentSchool"
              value={formData.currentSchool}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Nationality and Language *
              <input
                type="text"
                name="nationalityLanguage"
                value={formData.nationalityLanguage}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Child's Level of English
              <div className="english-level-container">
                <input
                  type="range"
                  name="englishLevel"
                  min="1"
                  max="5"
                  value={formData.englishLevel || '3'}
                  onChange={handleInputChange}
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
                  Level: {formData.englishLevel || '3'}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Parent Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>
              Parent Name 1 *
              <input
                type="text"
                name="parentName1"
                value={formData.parentName1}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Parent Name 2 *
              <input
                type="text"
                name="parentName2"
                value={formData.parentName2}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Parent 1 Passport Copy *
              <div className="file-input">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'parentPassport1')}
                  required
                />
                <Upload size={20} />
                <span>{files.parentPassport1?.name || 'Choose file'}</span>
              </div>
            </label>
          </div>
          <div className="form-group">
            <label>
              Parent 2 Passport Copy *
              <div className="file-input">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'parentPassport2')}
                  required
                />
                <Upload size={20} />
                <span>{files.parentPassport2?.name || 'Choose file'}</span>
              </div>
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
                value={formData.mobilePhone1}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              WeChat/WhatsApp ID 1 *
              <input
                type="text"
                name="wechatWhatsapp1"
                value={formData.wechatWhatsapp1}
                onChange={handleInputChange}
                required
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
                value={formData.mobilePhone2}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              WeChat/WhatsApp ID 2 *
              <input
                type="text"
                name="wechatWhatsapp2"
                value={formData.wechatWhatsapp2}
                onChange={handleInputChange}
                required
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
              value={formData.emergencyContact}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Health Information</h3>
        <div className="form-group">
          <label>
            Child's Allergies (if any) *
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Health or Behavioral Conditions *
            <textarea
              name="healthBehavioralConditions"
              value={formData.healthBehavioralConditions}
              onChange={handleInputChange}
              rows={3}
              placeholder="Are there any conditions our teachers should be aware of?"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="hasInsurance"
              checked={formData.hasInsurance || false}
              onChange={handleInputChange}
              required
            />
            <span>
              I confirm that my child has valid insurance coverage for the duration of the camp *
            </span>
          </label>
        </div>
      </div>

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
                checked={formData.photoPermission === 'grant'}
                onChange={handleInputChange}
                required
              />
              Grant permission
            </label>
            <label>
              <input
                type="radio"
                name="photoPermission"
                value="deny"
                checked={formData.photoPermission === 'deny'}
                onChange={handleInputChange}
                required
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
              value={formData.howDidYouFind}
              onChange={handleInputChange}
              placeholder="Please specify"
              required
            />
          </label>
        </div>
      </div>

      <div className="form-section acknowledgment">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="termsAcknowledged"
            checked={formData.termsAcknowledged}
            onChange={handleInputChange}
            required
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
            checked={formData.allStatementsTrue}
            onChange={handleInputChange}
            required
          />
          <span>
            I confirm that all information provided above is true and accurate to the best of my knowledge. *
          </span>
        </label>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading || formData.weeksSelected.length === 0}
      >
        {loading ? 'Submitting...' : 'Submit Registration'}
      </button>
    </form>
  )
}