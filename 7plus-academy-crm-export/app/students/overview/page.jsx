'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ArrowLeft, Search, Filter, Edit, Eye, User, GraduationCap, Users, Calendar, MapPin, Mail, Phone, Globe, X } from "lucide-react";

export default function StudentsOverviewPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    grade: '',
    stage: '',
    tier: '',
    nationality: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => {
      // Search term filter
      const matchesSearch = 
        student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Grade filter
      const matchesGrade = !filters.grade || student.grade_applying_for === filters.grade;
      
      // Stage filter
      const matchesStage = !filters.stage || student.current_stage === filters.stage;
      
      // Tier filter
      const matchesTier = !filters.tier || student.targetTier === filters.tier;
      
      // Nationality filter
      const matchesNationality = !filters.nationality || student.nationality === filters.nationality;
      
      return matchesSearch && matchesGrade && matchesStage && matchesTier && matchesNationality;
    });
    setFilteredStudents(filtered);
  }, [students, searchTerm, filters]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

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
    };
    return stageLabels[stage] || stage;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Students Overview</h1>
              <p className="text-sm text-gray-600">{filteredStudents.length} students</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/form">
              <Button size="sm">
                <User className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                value={filters.grade}
                onChange={(e) => setFilters({...filters, grade: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Grades</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
            
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select
                value={filters.nationality}
                onChange={(e) => setFilters({...filters, nationality: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Nationalities</option>
                <option value="Singapore">Singapore</option>
                <option value="Malaysia">Malaysia</option>
                <option value="China">China</option>
                <option value="Spain">Spain</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="UK">UK</option>
                <option value="Mexico">Mexico</option>
                <option value="New Zealand">New Zealand</option>
                <option value="India">India</option>
                <option value="South Africa">South Africa</option>
                <option value="Brazil">Brazil</option>
                <option value="Ireland">Ireland</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {student.first_name} {student.last_name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Link href={`/students/${student.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
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
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{student.nationality}</span>
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
                  <span className="text-blue-600 font-medium">
                    {getStageLabel(student.current_stage)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{new Date(student.joinDate).toLocaleDateString()}</span>
                </div>
                {student.isTier1Aspirant && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Tier 1 Aspirant
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h2>
                  <Button variant="ghost" onClick={() => setSelectedStudent(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="education">Education Details</TabsTrigger>
                    <TabsTrigger value="parents">Parents Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Full Name</label>
                          <p className="text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-gray-900">{selectedStudent.studentEmail}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Phone</label>
                          <p className="text-gray-900">{selectedStudent.studentPhone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                          <p className="text-gray-900">{selectedStudent.dateOfBirth}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nationality</label>
                          <p className="text-gray-900">{selectedStudent.nationality}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Place of Birth</label>
                          <p className="text-gray-900">{selectedStudent.placeOfBirth}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Passport Number</label>
                          <p className="text-gray-900">{selectedStudent.passportNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Passport Expiry</label>
                          <p className="text-gray-900">{selectedStudent.passportExpiryDate}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Education Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Education Level</label>
                          <p className="text-gray-900">{selectedStudent.educationType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Grade Applying For</label>
                          <p className="text-gray-900">{selectedStudent.grade_applying_for}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Current School</label>
                          <p className="text-gray-900">{selectedStudent.currentSchool || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Current Grade</label>
                          <p className="text-gray-900">{selectedStudent.currentGrade || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Application Stage</label>
                          <p className="text-blue-600 font-medium">{getStageLabel(selectedStudent.current_stage)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Join Date</label>
                          <p className="text-gray-900">{new Date(selectedStudent.joinDate).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="parents" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Parent Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Parent 1 */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Parent 1</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Name</label>
                              <p className="text-gray-900">{selectedStudent.parent1PassportName || 'Not provided'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Email</label>
                              <p className="text-gray-900">{selectedStudent.parent1Email || 'Not provided'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Phone</label>
                              <p className="text-gray-900">{selectedStudent.parent1Phone || 'Not provided'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Nationality</label>
                              <p className="text-gray-900">{selectedStudent.parent1Nationality || 'Not provided'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Employment Status</label>
                              <p className="text-gray-900">{selectedStudent.parent1EmploymentStatus || 'Not provided'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                              <p className="text-gray-900">{selectedStudent.parent1MonthlyIncome ? `SGD ${selectedStudent.parent1MonthlyIncome}` : 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Parent 2 (if married) */}
                        {selectedStudent.parent1MaritalStatus === 'married' && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Parent 2</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">Name</label>
                                <p className="text-gray-900">{selectedStudent.parent2PassportName || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-gray-900">{selectedStudent.parent2Email || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-gray-900">{selectedStudent.parent2Phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Nationality</label>
                                <p className="text-gray-900">{selectedStudent.parent2Nationality || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Employment Status</label>
                                <p className="text-gray-900">{selectedStudent.parent2EmploymentStatus || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                                <p className="text-gray-900">{selectedStudent.parent2MonthlyIncome ? `SGD ${selectedStudent.parent2MonthlyIncome}` : 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">There are no students matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
} 