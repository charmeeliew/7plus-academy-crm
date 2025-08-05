'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  Brain, 
  School, 
  GraduationCap, 
  DollarSign, 
  Award, 
  MapPin, 
  Users,
  Calendar,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function SchoolRecommendation({ students = [] }) {
  const [schools, setSchools] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [filters, setFilters] = useState({
    maxTuition: '',
    minAcademicScore: '',
    preferredCurriculum: '',
    preferredTier: ''
  })

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    if (selectedStudent && schools.length > 0) {
      generateRecommendations()
    }
  }, [selectedStudent, schools, filters])

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools')
      const data = await response.json()
      setSchools(data)
    } catch (error) {
      console.error('Error fetching schools:', error)
    }
  }

  const generateRecommendations = () => {
    setLoading(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const recommendations = schools
        .filter(school => {
          // Filter by student's grade level
          const studentGrade = selectedStudent?.grade_applying_for || 'high_school'
          const gradeMatches = school.gradesAccepted.some(grade => {
            if (studentGrade === 'high_school') return grade.includes('Grade 10') || grade.includes('Grade 11') || grade.includes('Grade 12')
            if (studentGrade === 'middle_school') return grade.includes('Grade 6') || grade.includes('Grade 7') || grade.includes('Grade 8') || grade.includes('Grade 9')
            if (studentGrade === 'undergraduate') return grade.includes('Undergraduate')
            if (studentGrade === 'graduate') return grade.includes('Graduate')
            return true
          })

          // Filter by nationality
          const nationalityMatches = school.nationalities.includes(selectedStudent?.nationality || 'Singapore')

          // Filter by tuition fee
          const tuitionMatches = !filters.maxTuition || school.tuitionFee <= parseInt(filters.maxTuition)

          // Filter by academic score
          const scoreMatches = !filters.minAcademicScore || school.academicScore >= parseInt(filters.minAcademicScore)

          // Filter by curriculum preference
          const curriculumMatches = !filters.preferredCurriculum || school.curriculum === filters.preferredCurriculum

          // Filter by tier preference
          const tierMatches = !filters.preferredTier || school.tier === filters.preferredTier

          return gradeMatches && nationalityMatches && tuitionMatches && scoreMatches && curriculumMatches && tierMatches
        })
        .map(school => {
          // Calculate recommendation score based on multiple factors
          let score = 0
          
          // Academic fit (40% weight)
          const academicFit = Math.max(0, 100 - Math.abs(school.academicScore - (selectedStudent?.academicScore || 80)))
          score += academicFit * 0.4
          
          // Financial fit (25% weight)
          const budgetFit = selectedStudent?.budget ? Math.max(0, 100 - ((school.tuitionFee - selectedStudent.budget) / selectedStudent.budget * 100)) : 80
          score += budgetFit * 0.25
          
          // Tier alignment (20% weight)
          const tierAlignment = selectedStudent?.targetTier === school.tier ? 100 : 
                              (selectedStudent?.targetTier === 'Tier 1' && school.tier === 'Tier 2') ? 70 :
                              (selectedStudent?.targetTier === 'Tier 1' && school.tier === 'Tier 3') ? 40 : 60
          score += tierAlignment * 0.2
          
          // EAL support (15% weight)
          const ealSupport = school.ealAssistance && selectedStudent?.needsEAL ? 100 : 80
          score += ealSupport * 0.15
          
          return {
            ...school,
            recommendationScore: Math.round(score),
            matchReasons: generateMatchReasons(school, selectedStudent)
          }
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 5) // Top 5 recommendations

      setRecommendations(recommendations)
      setLoading(false)
    }, 1000)
  }

  const generateMatchReasons = (school, student) => {
    const reasons = []
    
    if (school.tier === student?.targetTier) {
      reasons.push('Perfect tier match')
    } else if (school.tier === 'Tier 1' && student?.targetTier === 'Tier 1') {
      reasons.push('Tier 1 target achieved')
    }
    
    if (school.ealAssistance && student?.needsEAL) {
      reasons.push('EAL support available')
    }
    
    if (school.curriculum === 'IB' && student?.preferredCurriculum === 'IB') {
      reasons.push('Preferred IB curriculum')
    }
    
    if (school.tuitionFee <= (student?.budget || 50000)) {
      reasons.push('Within budget')
    }
    
    if (school.nationalities.includes(student?.nationality)) {
      reasons.push('Accepts your nationality')
    }
    
    return reasons
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (score >= 80) return <Star className="w-4 h-4 text-blue-600" />
    if (score >= 70) return <Star className="w-4 h-4 text-yellow-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI School Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No students available for recommendations.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI School Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Student Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Student
          </label>
          <select
            value={selectedStudent?.id || ''}
            onChange={(e) => {
              const student = students.find(s => s.id === parseInt(e.target.value))
              setSelectedStudent(student || null)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name} - {student.grade_applying_for}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Budget (SGD)
            </label>
            <Input
              type="number"
              placeholder="e.g., 35000"
              value={filters.maxTuition}
              onChange={(e) => setFilters({...filters, maxTuition: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Academic Score
            </label>
            <Input
              type="number"
              placeholder="e.g., 80"
              value={filters.minAcademicScore}
              onChange={(e) => setFilters({...filters, minAcademicScore: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Curriculum
            </label>
            <select
              value={filters.preferredCurriculum}
              onChange={(e) => setFilters({...filters, preferredCurriculum: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Curriculum</option>
              <option value="IB">IB</option>
              <option value="British">British</option>
              <option value="American">American</option>
              <option value="Singapore">Singapore</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Tier
            </label>
            <select
              value={filters.preferredTier}
              onChange={(e) => setFilters({...filters, preferredTier: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Tier</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is analyzing schools for the best matches...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((school, index) => (
              <Card key={school.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{school.name}</h3>
                        <Badge className={school.type === 'K-12' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'}>
                          {school.type === 'K-12' ? <School className="w-3 h-3 mr-1" /> : <GraduationCap className="w-3 h-3 mr-1" />}
                          {school.type}
                        </Badge>
                        <Badge className={school.tier === 'Tier 1' ? 'bg-green-100 text-green-800' : 
                                        school.tier === 'Tier 2' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                          <Award className="w-3 h-3 mr-1" />
                          {school.tier}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                          <span>${school.tuitionFee.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Score: {school.academicScore}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Intake: {school.intake}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Enroll: {school.enrollmentMonth}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                          <span>{school.address}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {school.matchReasons.map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center ml-4">
                      <div className={`text-2xl font-bold ${getScoreColor(school.recommendationScore)}`}>
                        {school.recommendationScore}%
                      </div>
                      <div className="text-xs text-gray-500">Match Score</div>
                      {getScoreIcon(school.recommendationScore)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {recommendations.length === 0 && (
              <div className="text-center py-8">
                <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
                <p className="text-gray-600">Try adjusting your filters or criteria.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 