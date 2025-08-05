'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplicationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Student Information
    studentPhoto: null,
    educationLevel: '', // K12 or University
    gradeLevel: '', // Pre-KG, KG1, KG2, Grade 1-12, or University level
    passportName: '',
    englishName: '',
    chineseName: '',
    studentEmail: '',
    studentPhone: '',
    dateOfBirth: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportUpload: null,
    placeOfBirth: '',
    nationality: '',
    birthCertificateOriginal: null,
    birthCertificateNotarised: null,
    issuingAuthority: '',
    singaporeAddress: '',
    domesticAddress: '',
    currentSchool: '',
    currentGrade: '',
    schoolResultSlipLatest: null,
    schoolResultSlipPast2Years: null,
    currentTeacherName: '',
    currentTeacherEmail: '',
    letterOfReferral: null,
    
    // Parent Information
    parent1Relationship: '', // father, mother, guardian, others
    parent1MaritalStatus: '', // married, divorced, widowed, single
    parent1PassportName: '',
    parent1PassportNumber: '',
    parent1PassportIssueDate: '',
    parent1PassportExpiryDate: '',
    parent1PassportUpload: null,
    parent1DateOfBirth: '',
    parent1Nationality: '',
    parent1PlaceOfBirth: '',
    parent1Phone: '',
    parent1Email: '',
    parent1PreferredContact: '', // email or phone
    parent1HighestEducation: '',
    parent1MarriageCertificate: null,
    parent1EmploymentStatus: '', // employed, self-employed, retired, unemployed
    parent1Occupation: '',
    parent1CompanyAddress: '',
    parent1CompanyName: '',
    parent1EmployerName: '',
    parent1EmployerPhone: '',
    parent1SelfEmploymentProof: null,
    parent1MonthlyIncome: '',
    parent1PassType: '',
    parent1FIN: '',
    parent1PassValidity: '',
    
    // Parent 2 Information (if married)
    parent2PassportName: '',
    parent2PassportNumber: '',
    parent2PassportIssueDate: '',
    parent2PassportExpiryDate: '',
    parent2PassportUpload: null,
    parent2DateOfBirth: '',
    parent2Nationality: '',
    parent2PlaceOfBirth: '',
    parent2Phone: '',
    parent2Email: '',
    parent2PreferredContact: '',
    parent2HighestEducation: '',
    parent2EmploymentStatus: '',
    parent2Occupation: '',
    parent2CompanyAddress: '',
    parent2CompanyName: '',
    parent2EmployerName: '',
    parent2EmployerPhone: '',
    parent2SelfEmploymentProof: null,
    parent2MonthlyIncome: '',
    parent2PassType: '',
    parent2FIN: '',
    parent2PassValidity: '',
    
    // Additional Information
    referralSource: '', // Referral, Little Red Book, Official Account, TikTok
    siblingStudentId: '', // To link related students
    
    // Tier System
    targetTier: '', // Tier 1, Tier 2, Tier 3, etc.
    currentSchoolTier: '', // Current school tier
    isTier1Aspirant: false, // Automatically set if target is Tier 1 but current is lower
    
    // System fields
    joinDate: new Date().toISOString().split('T')[0],
    currentStage: 'consultation'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      }
      
      // Auto-set tier 1 aspirant status
      if (name === 'targetTier' || name === 'currentSchoolTier') {
        const targetTier = name === 'targetTier' ? value : prev.targetTier
        const currentTier = name === 'currentSchoolTier' ? value : prev.currentSchoolTier
        
        if (targetTier === 'Tier 1' && currentTier && currentTier !== 'Tier 1') {
          newData.isTier1Aspirant = true
        } else if (targetTier === 'Tier 1' && (!currentTier || currentTier === 'Tier 1')) {
          newData.isTier1Aspirant = false
        }
      }
      
      return newData
    })
  }

  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldName === 'schoolResultSlipPast2Years' ? files : files[0]
    }))
  }

  // Validation functions
  const validatePassportDates = (issueDate, expiryDate) => {
    const today = new Date()
    const issue = new Date(issueDate)
    const expiry = new Date(expiryDate)
    
    if (issue >= today) {
      return "Passport issue date must be before today"
    }
    if (expiry <= issue) {
      return "Passport expiry date must be after issue date"
    }
    if (expiry <= today) {
      return "Passport expiry date must be after today"
    }
    return null
  }

  const validateRequiredFields = (step) => {
    const errors = []
    
    if (step === 1) {
      if (!formData.educationLevel) errors.push("Education level is required")
      if (!formData.gradeLevel) errors.push("Grade level is required")
      if (!formData.passportName) errors.push("Passport name is required")
      if (!formData.studentEmail) errors.push("Student email is required")
      if (!formData.dateOfBirth) errors.push("Date of birth is required")
      if (!formData.passportNumber) errors.push("Passport number is required")
      if (!formData.passportIssueDate) errors.push("Passport issue date is required")
      if (!formData.passportExpiryDate) errors.push("Passport expiry date is required")
      if (!formData.placeOfBirth) errors.push("Place of birth is required")
      if (!formData.nationality) errors.push("Nationality is required")
    }
    
    if (step === 2) {
      if (!formData.parent1Relationship) errors.push("Parent 1 relationship is required")
      if (!formData.parent1MaritalStatus) errors.push("Parent 1 marital status is required")
      if (!formData.parent1PassportName) errors.push("Parent 1 passport name is required")
      if (!formData.parent1PassportNumber) errors.push("Parent 1 passport number is required")
      if (!formData.parent1Phone) errors.push("Parent 1 phone is required")
      if (!formData.parent1Email) errors.push("Parent 1 email is required")
      
      if (formData.parent1MaritalStatus === 'married') {
        if (!formData.parent2PassportName) errors.push("Parent 2 passport name is required")
        if (!formData.parent2PassportNumber) errors.push("Parent 2 passport number is required")
        if (!formData.parent2Phone) errors.push("Parent 2 phone is required")
        if (!formData.parent2Email) errors.push("Parent 2 email is required")
      }
    }
    
    return errors
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Application submitted successfully!')
        router.push('/')
      } else {
        alert('Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ''
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const calculateGrade = (dateOfBirth) => {
    if (!dateOfBirth) return ''
    const age = calculateAge(dateOfBirth)
    if (age >= 18) return 'University'
    if (age >= 14) return 'High School'
    if (age >= 11) return 'Middle School'
    return 'Primary School'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Application Form
            </h1>
            <p className="text-gray-600">
              Step {currentStep} of 3
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Student Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Student Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Photo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Photo *
                  </label>
                  <input
                    type="file"
                    name="studentPhoto"
                    onChange={(e) => handleFileChange(e, 'studentPhoto')}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level *
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Education Level</option>
                    <option value="K12">K12</option>
                    <option value="University">University</option>
                  </select>
                </div>

                {/* Grade Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level *
                  </label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Grade Level</option>
                    {formData.educationLevel === 'K12' ? (
                      <>
                        <option value="Pre-KG">Pre-KG</option>
                        <option value="KG1">KG1</option>
                        <option value="KG2">KG2</option>
                        {Array.from({length: 12}, (_, i) => i + 1).map(grade => (
                          <option key={grade} value={`Grade ${grade}`}>Grade {grade}</option>
                        ))}
                      </>
                    ) : (
                      <>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="PhD">PhD</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Passport Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Name *
                  </label>
                  <input
                    type="text"
                    name="passportName"
                    value={formData.passportName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* English Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Name (if any)
                  </label>
                  <input
                    type="text"
                    name="englishName"
                    value={formData.englishName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Chinese Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chinese Name
                  </label>
                  <input
                    type="text"
                    name="chineseName"
                    value={formData.chineseName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Student Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Email *
                  </label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Student Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Phone Number
                  </label>
                  <input
                    type="tel"
                    name="studentPhone"
                    value={formData.studentPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Passport Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Number *
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Passport Issue Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Issue Date *
                  </label>
                  <input
                    type="date"
                    name="passportIssueDate"
                    value={formData.passportIssueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Passport Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="passportExpiryDate"
                    value={formData.passportExpiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Passport Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Upload *
                  </label>
                  <input
                    type="file"
                    name="passportUpload"
                    onChange={(e) => handleFileChange(e, 'passportUpload')}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Place of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place of Birth *
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Target Tier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target School Tier *
                  </label>
                  <select
                    name="targetTier"
                    value={formData.targetTier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Target Tier</option>
                    <option value="Tier 1">Tier 1 (Top Schools)</option>
                    <option value="Tier 2">Tier 2 (Good Schools)</option>
                    <option value="Tier 3">Tier 3 (Standard Schools)</option>
                    <option value="Tier 4">Tier 4 (Basic Schools)</option>
                  </select>
                </div>

                {/* Current School Tier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current School Tier
                  </label>
                  <select
                    name="currentSchoolTier"
                    value={formData.currentSchoolTier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Current Tier</option>
                    <option value="Tier 1">Tier 1 (Top Schools)</option>
                    <option value="Tier 2">Tier 2 (Good Schools)</option>
                    <option value="Tier 3">Tier 3 (Standard Schools)</option>
                    <option value="Tier 4">Tier 4 (Basic Schools)</option>
                  </select>
                </div>

                {/* Sibling Student ID */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sibling Student ID (if any)
                  </label>
                  <input
                    type="text"
                    name="siblingStudentId"
                    value={formData.siblingStudentId}
                    onChange={handleInputChange}
                    placeholder="Enter sibling's student ID to link them"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the student ID of a sibling if they are already in the system
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!formData.educationLevel || !formData.gradeLevel || !formData.passportName || !formData.studentEmail || !formData.dateOfBirth || !formData.passportNumber || !formData.passportIssueDate || !formData.passportExpiryDate || !formData.placeOfBirth || !formData.nationality}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Educational Background */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Educational Background
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Applying for K-12 School or University
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="educationType"
                      value="K-12 School"
                      checked={formData.educationType === "K-12 School"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    K-12 School
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="educationType"
                      value="University"
                      checked={formData.educationType === "University"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    University
                  </label>
                </div>
              </div>

              {formData.educationType === "K-12 School" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Level
                  </label>
                  <select
                    name="schoolLevel"
                    value={formData.schoolLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select School Level</option>
                    <option value="Primary School">Primary School</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                  </select>
                </div>
              )}

              {formData.educationType === "K-12 School" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last 2 Years' Result Slips *
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'lastTwoYearsResults')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload multiple files (PDF, DOC, DOCX, JPG, PNG)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latest Semester's Result Slip *
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'latestSemesterResult')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload one file (PDF, DOC, DOCX, JPG, PNG)
                    </p>
                  </div>
                </div>
              )}

              {formData.educationType === "University" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous School Qualifications (e.g., A-Levels, IB, SATs) *
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'previousQualifications')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload qualification documents (PDF, DOC, DOCX, JPG, PNG)
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.educationLevel || !formData.gradeLevel}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Review & Submit
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Application Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Passport Name</p>
                    <p className="text-gray-900">{formData.passportName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">English Name</p>
                    <p className="text-gray-900">{formData.englishName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Chinese Name</p>
                    <p className="text-gray-900">{formData.chineseName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                    <p className="text-gray-900">{formData.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Age</p>
                    <p className="text-gray-900">{calculateAge(formData.dateOfBirth)} years old</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Education Level</p>
                    <p className="text-gray-900">{formData.educationLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Grade Level</p>
                    <p className="text-gray-900">{formData.gradeLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Student Email</p>
                    <p className="text-gray-900">{formData.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Student Phone</p>
                    <p className="text-gray-900">{formData.studentPhone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nationality</p>
                    <p className="text-gray-900">{formData.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Place of Birth</p>
                    <p className="text-gray-900">{formData.placeOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Passport Number</p>
                    <p className="text-gray-900">{formData.passportNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Passport Issue Date</p>
                    <p className="text-gray-900">{formData.passportIssueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Passport Expiry Date</p>
                    <p className="text-gray-900">{formData.passportExpiryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current School</p>
                    <p className="text-gray-900">{formData.currentSchool || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Grade</p>
                    <p className="text-gray-900">{formData.currentGrade || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Parent 1 Relationship</p>
                    <p className="text-gray-900">{formData.parent1Relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Parent 1 Marital Status</p>
                    <p className="text-gray-900">{formData.parent1MaritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Parent 1 Name</p>
                    <p className="text-gray-900">{formData.parent1PassportName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Parent 1 Email</p>
                    <p className="text-gray-900">{formData.parent1Email}</p>
                  </div>
                  {formData.parent1MaritalStatus === 'married' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Parent 2 Name</p>
                        <p className="text-gray-900">{formData.parent2PassportName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Parent 2 Email</p>
                        <p className="text-gray-900">{formData.parent2Email}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Target School Tier</p>
                    <p className="text-gray-900">{formData.targetTier}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current School Tier</p>
                    <p className="text-gray-900">{formData.currentSchoolTier || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tier 1 Aspirant</p>
                    <p className="text-gray-900">{formData.isTier1Aspirant ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Sibling Student ID</p>
                    <p className="text-gray-900">{formData.siblingStudentId || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Referral Source</p>
                    <p className="text-gray-900">{formData.referralSource || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Join Date</p>
                    <p className="text-gray-900">{formData.joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 