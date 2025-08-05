'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Users, 
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  Settings
} from "lucide-react"
import DashboardLayout from "../../../components/layout/DashboardLayout"

export default function AssignTasksPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [filters, setFilters] = useState({
    stage: '',
    staff: '',
    tier: ''
  })

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCurrentUser(userData)
      
      // Only allow admin access
      if (userData.role !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
    }
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, filters])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
        setFilteredStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterStudents = () => {
    let filtered = students.filter(student => {
      // Stage filter
      const matchesStage = !filters.stage || student.current_stage === filters.stage
      
      // Staff filter
      const assignedStaff = getAssignedStaff(student.current_stage)
      const matchesStaff = !filters.staff || assignedStaff === filters.staff
      
      // Tier filter
      const matchesTier = !filters.tier || student.targetTier === filters.tier
      
      return matchesStage && matchesStaff && matchesTier
    })

    setFilteredStudents(filtered)
  }

  const getAssignedStaff = (stage) => {
    const staffAssignments = {
      consultation: 'Staff A',
      engagement: 'Staff A', 
      data_collection: 'Staff A',
      data_enhancement: 'Staff A',
      exam_preparation: 'Staff B',
      file_application: 'Staff B',
      entrance_exam: 'Staff B',
      offer_rejection: 'Staff B',
      student_contract: 'Staff B',
      stp_application: 'Staff C',
      travel_arrangement: 'Staff C',
      landing: 'Staff C',
      stp_collection: 'Staff C',
      ltvp_application: 'Staff C',
      ltvp_collection: 'Staff C',
      case_close_plan_b: 'Completed'
    }
    return staffAssignments[stage] || 'Unassigned'
  }

  const getStageLabel = (stage) => {
    const stageLabels = {
      consultation: "Stage 1: Consultation",
      engagement: "Stage 2: Engagement",
      data_collection: "Stage 3: Data Collection",
      data_enhancement: "Stage 4: Data Enhancement",
      exam_preparation: "Stage 5: Exam Preparation",
      file_application: "Stage 6: File Application",
      entrance_exam: "Stage 7: Entrance Exam",
      offer_rejection: "Stage 8: Offer/Rejection",
      student_contract: "Stage 9: Student Contract",
      stp_application: "Stage 10: STP Application",
      travel_arrangement: "Stage 11: Travel Arrangement",
      landing: "Stage 12: Landing",
      stp_collection: "Stage 13: STP Collection",
      ltvp_application: "Stage 14: LTVP Application",
      ltvp_collection: "Stage 15: LTVP Collection",
      case_close_plan_b: "Stage 16: Case Close/Plan B"
    }
    return stageLabels[stage] || stage
  }

  const getStageColor = (stage) => {
    const colors = {
      consultation: "bg-blue-100 text-blue-800",
      engagement: "bg-blue-100 text-blue-800",
      data_collection: "bg-blue-100 text-blue-800",
      data_enhancement: "bg-blue-100 text-blue-800",
      exam_preparation: "bg-green-100 text-green-800",
      file_application: "bg-green-100 text-green-800",
      entrance_exam: "bg-green-100 text-green-800",
      offer_rejection: "bg-green-100 text-green-800",
      student_contract: "bg-green-100 text-green-800",
      stp_application: "bg-purple-100 text-purple-800",
      travel_arrangement: "bg-purple-100 text-purple-800",
      landing: "bg-purple-100 text-purple-800",
      stp_collection: "bg-purple-100 text-purple-800",
      ltvp_application: "bg-purple-100 text-purple-800",
      ltvp_collection: "bg-purple-100 text-purple-800",
      case_close_plan_b: "bg-gray-100 text-gray-800"
    }
    return colors[stage] || "bg-gray-100 text-gray-800"
  }

  const getStaffColor = (staff) => {
    const colors = {
      'Staff A': 'bg-blue-100 text-blue-800',
      'Staff B': 'bg-green-100 text-green-800',
      'Staff C': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Unassigned': 'bg-yellow-100 text-yellow-800'
    }
    return colors[staff] || 'bg-gray-100 text-gray-800'
  }

  const handleReassignStaff = async (studentId, newStaff) => {
    try {
      // Map staff to appropriate stage
      const staffToStage = {
        'Staff A': 'consultation',
        'Staff B': 'exam_preparation',
        'Staff C': 'stp_application',
        'Completed': 'case_close_plan_b'
      }
      
      const newStage = staffToStage[newStaff]
      if (!newStage) {
        alert('Invalid staff assignment')
        return
      }
      
      // Update the student's stage in the local state
      const updatedStudents = students.map(student => 
        student.id === studentId 
          ? { ...student, current_stage: newStage }
          : student
      )
      
      setStudents(updatedStudents)
      setFilteredStudents(updatedStudents)
      
      // In a real implementation, you would make an API call here
      // await fetch(`/api/students/${studentId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ current_stage: newStage })
      // })
      
      alert(`Student ${studentId} successfully reassigned to ${newStaff}`)
    } catch (error) {
      console.error('Error reassigning staff:', error)
      alert('Error reassigning staff')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (currentUser?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign Tasks to Staff</h1>
          <p className="text-gray-600">
            Manage student assignments and staff workload distribution
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={filters.stage}
                  onChange={(e) => setFilters({...filters, stage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Stages</option>
                  <option value="consultation">Consultation</option>
                  <option value="engagement">Engagement</option>
                  <option value="data_collection">Data Collection</option>
                  <option value="data_enhancement">Data Enhancement</option>
                  <option value="exam_preparation">Exam Preparation</option>
                  <option value="file_application">File Application</option>
                  <option value="entrance_exam">Entrance Exam</option>
                  <option value="offer_rejection">Offer/Rejection</option>
                  <option value="student_contract">Student Contract</option>
                  <option value="stp_application">STP Application</option>
                  <option value="travel_arrangement">Travel Arrangement</option>
                  <option value="landing">Landing</option>
                  <option value="stp_collection">STP Collection</option>
                  <option value="ltvp_application">LTVP Application</option>
                  <option value="ltvp_collection">LTVP Collection</option>
                  <option value="case_close_plan_b">Case Close/Plan B</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Staff</label>
                <select
                  value={filters.staff}
                  onChange={(e) => setFilters({...filters, staff: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Staff</option>
                  <option value="Staff A">Staff A</option>
                  <option value="Staff B">Staff B</option>
                  <option value="Staff C">Staff C</option>
                  <option value="Completed">Completed</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Tier</label>
                <select
                  value={filters.tier}
                  onChange={(e) => setFilters({...filters, tier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Tiers</option>
                  <option value="Tier 1">Tier 1</option>
                  <option value="Tier 2">Tier 2</option>
                  <option value="Tier 3">Tier 3</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Workload Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff A</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {students.filter(s => ['consultation', 'engagement', 'data_collection', 'data_enhancement'].includes(s.current_stage)).length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff B</p>
                  <p className="text-2xl font-bold text-green-600">
                    {students.filter(s => ['exam_preparation', 'file_application', 'entrance_exam', 'offer_rejection', 'student_contract'].includes(s.current_stage)).length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff C</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {students.filter(s => ['stp_application', 'travel_arrangement', 'landing', 'stp_collection', 'ltvp_application', 'ltvp_collection'].includes(s.current_stage)).length}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {students.filter(s => s.current_stage === 'case_close_plan_b').length}
                  </p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const assignedStaff = getAssignedStaff(student.current_stage)
            return (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {student.current_stage === 'case_close_plan_b' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      <CardTitle className="text-lg">
                        {student.first_name} {student.last_name}
                      </CardTitle>
                    </div>
                    <Badge className={getStageColor(student.current_stage)}>
                      {getStageLabel(student.current_stage)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 font-medium">ID: {student.id}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{student.studentEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{student.grade_applying_for}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{student.targetTier}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <Badge className={getStaffColor(assignedStaff)}>
                      {assignedStaff}
                    </Badge>
                  </div>
                  
                  {student.current_stage !== 'case_close_plan_b' && (
                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReassignStaff(student.id, 'Staff A')}
                          disabled={assignedStaff === 'Staff A'}
                        >
                          Assign to Staff A
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReassignStaff(student.id, 'Staff B')}
                          disabled={assignedStaff === 'Staff B'}
                        >
                          Assign to Staff B
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReassignStaff(student.id, 'Staff C')}
                          disabled={assignedStaff === 'Staff C'}
                        >
                          Assign to Staff C
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReassignStaff(student.id, 'Completed')}
                          disabled={assignedStaff === 'Completed'}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more students.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 