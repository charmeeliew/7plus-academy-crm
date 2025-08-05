'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Users, 
  Award,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import DashboardLayout from "../../components/layout/DashboardLayout"

export default function TasksPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
        filterStudentsByRole(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterStudentsByRole = (studentsData) => {
    if (!currentUser) return

    let filtered = []
    if (currentUser.role === 'admin') {
      // Admin sees all students with staff assignment info
      filtered = studentsData.map(student => {
        const assignedStaff = getAssignedStaff(student.current_stage)
        return { ...student, assignedStaff }
      })
    } else if (currentUser.role === 'staff' && currentUser.assignedStages) {
      // Staff sees only students in their assigned stages
      filtered = studentsData.filter(student => 
        currentUser.assignedStages.includes(student.current_stage)
      )
    }

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

  const getPriorityIcon = (stage) => {
    // Early stages are high priority
    const earlyStages = ['consultation', 'engagement', 'data_collection', 'data_enhancement']
    if (earlyStages.includes(stage)) {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">
            {currentUser?.name} - {filteredStudents.length} assigned students
          </p>
        </div>

        {currentUser?.role === 'staff' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Assigned Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentUser.assignedStages?.map((stage) => (
                  <Badge key={stage} className={getStageColor(stage)}>
                    {getStageLabel(stage)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(student.current_stage)}
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
                {currentUser?.role === 'admin' && student.assignedStaff && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Assigned to: {student.assignedStaff}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{student.studentEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{student.educationType}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{student.grade_applying_for}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Joined: {new Date(student.joinDate).toLocaleDateString()}
                  </span>
                </div>
                {student.isTier1Aspirant && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Tier 1 Aspirant
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <Button size="sm" className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-600">
              {currentUser?.role === 'admin' 
                ? 'All students are up to date!' 
                : 'No students are currently in your assigned stages.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 