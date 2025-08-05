'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ArrowLeft, Edit, Save, X, User, GraduationCap, Users, Calendar, MapPin, Mail, Phone, Globe, Award, FileText, Building, CreditCard } from "lucide-react";

export default function StudentDetailPage({ params }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const students = await response.json();
        const foundStudent = students.find(s => s.id == params.id);
        if (foundStudent) {
          setStudent(foundStudent);
          setEditData(foundStudent);
        }
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the student
      setStudent({ ...student, ...editData });
      setEditing(false);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleCancel = () => {
    setEditData(student);
    setEditing(false);
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
          <p className="mt-4 text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student not found</h2>
          <p className="text-gray-600 mb-4">The student you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
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
              <h1 className="text-xl font-bold text-gray-900">
                {student.first_name} {student.last_name}
              </h1>
              <p className="text-sm text-gray-600">Student ID: {student.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {editing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="education">Education Details</TabsTrigger>
            <TabsTrigger value="tier">Tier Info</TabsTrigger>
            <TabsTrigger value="parents">Parents Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.first_name || ''}
                      onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.first_name} {student.last_name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={editData.studentEmail || ''}
                      onChange={(e) => setEditData({...editData, studentEmail: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.studentEmail}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={editData.studentPhone || ''}
                      onChange={(e) => setEditData({...editData, studentPhone: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.studentPhone || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  {editing ? (
                    <input
                      type="date"
                      value={editData.dateOfBirth || ''}
                      onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nationality</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.nationality || ''}
                      onChange={(e) => setEditData({...editData, nationality: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.nationality}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Place of Birth</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.placeOfBirth || ''}
                      onChange={(e) => setEditData({...editData, placeOfBirth: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.placeOfBirth}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Passport Number</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.passportNumber || ''}
                      onChange={(e) => setEditData({...editData, passportNumber: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.passportNumber}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Passport Expiry</label>
                  {editing ? (
                    <input
                      type="date"
                      value={editData.passportExpiryDate || ''}
                      onChange={(e) => setEditData({...editData, passportExpiryDate: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.passportExpiryDate}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Education Level</label>
                  {editing ? (
                    <select
                      value={editData.educationType || ''}
                      onChange={(e) => setEditData({...editData, educationType: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="K-12 School">K-12 School</option>
                      <option value="University">University</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{student.educationType}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Grade Applying For</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.grade_applying_for || ''}
                      onChange={(e) => setEditData({...editData, grade_applying_for: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.grade_applying_for}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current School</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.currentSchool || ''}
                      onChange={(e) => setEditData({...editData, currentSchool: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.currentSchool || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Grade</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.currentGrade || ''}
                      onChange={(e) => setEditData({...editData, currentGrade: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.currentGrade || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Application Stage</label>
                  {editing ? (
                    <select
                      value={editData.current_stage || ''}
                      onChange={(e) => setEditData({...editData, current_stage: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="consultation">Stage 1: Consultation</option>
                      <option value="engagement">Stage 2: Engagement</option>
                      <option value="data_collection">Stage 3: Data Collection</option>
                      <option value="data_enhancement">Stage 4: Data Enhancement</option>
                      <option value="exam_preparation">Stage 5: Exam Preparation</option>
                      <option value="file_application">Stage 6: File Application</option>
                      <option value="entrance_exam">Stage 7: Entrance Exam</option>
                      <option value="offer_rejection">Stage 8: Offer/Rejection</option>
                      <option value="student_contract">Stage 9: Student Contract</option>
                      <option value="stp_application">Stage 10: STP Application</option>
                      <option value="travel_arrangement">Stage 11: Travel Arrangement</option>
                      <option value="landing">Stage 12: Landing</option>
                      <option value="stp_collection">Stage 13: STP Collection</option>
                      <option value="ltvp_application">Stage 14: LTVP Application</option>
                      <option value="ltvp_collection">Stage 15: LTVP Collection</option>
                      <option value="case_close_plan_b">Stage 16: Case Close/Plan B</option>
                    </select>
                  ) : (
                    <p className="text-blue-600 font-medium">{getStageLabel(student.current_stage)}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                  {editing ? (
                    <input
                      type="date"
                      value={editData.joinDate || ''}
                      onChange={(e) => setEditData({...editData, joinDate: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(student.joinDate).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tier" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Tier Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Target School Tier</label>
                  {editing ? (
                    <select
                      value={editData.targetTier || ''}
                      onChange={(e) => setEditData({...editData, targetTier: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Target Tier</option>
                      <option value="Tier 1">Tier 1 (Top Schools)</option>
                      <option value="Tier 2">Tier 2 (Good Schools)</option>
                      <option value="Tier 3">Tier 3 (Standard Schools)</option>
                      <option value="Tier 4">Tier 4 (Basic Schools)</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{student.targetTier}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current School Tier</label>
                  {editing ? (
                    <select
                      value={editData.currentSchoolTier || ''}
                      onChange={(e) => setEditData({...editData, currentSchoolTier: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Current Tier</option>
                      <option value="Tier 1">Tier 1 (Top Schools)</option>
                      <option value="Tier 2">Tier 2 (Good Schools)</option>
                      <option value="Tier 3">Tier 3 (Standard Schools)</option>
                      <option value="Tier 4">Tier 4 (Basic Schools)</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{student.currentSchoolTier || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tier 1 Aspirant</label>
                  <p className="text-gray-900">{student.isTier1Aspirant ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sibling Student ID</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.siblingStudentId || ''}
                      onChange={(e) => setEditData({...editData, siblingStudentId: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter sibling student ID"
                    />
                  ) : (
                    <p className="text-gray-900">{student.siblingStudentId || 'None'}</p>
                  )}
                </div>
                {student.siblingStudentId && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Sibling Information</label>
                    <p className="text-gray-900">
                      This student is linked to sibling with ID: {student.siblingStudentId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Parent Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Parent 1 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Parent 1</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={editData.parent1PassportName || ''}
                          onChange={(e) => setEditData({...editData, parent1PassportName: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{student.parent1PassportName || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      {editing ? (
                        <input
                          type="email"
                          value={editData.parent1Email || ''}
                          onChange={(e) => setEditData({...editData, parent1Email: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{student.parent1Email || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      {editing ? (
                        <input
                          type="tel"
                          value={editData.parent1Phone || ''}
                          onChange={(e) => setEditData({...editData, parent1Phone: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{student.parent1Phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nationality</label>
                      {editing ? (
                        <input
                          type="text"
                          value={editData.parent1Nationality || ''}
                          onChange={(e) => setEditData({...editData, parent1Nationality: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{student.parent1Nationality || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Employment Status</label>
                      {editing ? (
                        <select
                          value={editData.parent1EmploymentStatus || ''}
                          onChange={(e) => setEditData({...editData, parent1EmploymentStatus: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self-employed</option>
                          <option value="retired">Retired</option>
                          <option value="unemployed">Unemployed</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{student.parent1EmploymentStatus || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                      {editing ? (
                        <input
                          type="number"
                          value={editData.parent1MonthlyIncome || ''}
                          onChange={(e) => setEditData({...editData, parent1MonthlyIncome: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="SGD"
                        />
                      ) : (
                        <p className="text-gray-900">{student.parent1MonthlyIncome ? `SGD ${student.parent1MonthlyIncome}` : 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parent 2 (if married) */}
                {student.parent1MaritalStatus === 'married' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Parent 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        {editing ? (
                          <input
                            type="text"
                            value={editData.parent2PassportName || ''}
                            onChange={(e) => setEditData({...editData, parent2PassportName: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{student.parent2PassportName || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        {editing ? (
                          <input
                            type="email"
                            value={editData.parent2Email || ''}
                            onChange={(e) => setEditData({...editData, parent2Email: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{student.parent2Email || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        {editing ? (
                          <input
                            type="tel"
                            value={editData.parent2Phone || ''}
                            onChange={(e) => setEditData({...editData, parent2Phone: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{student.parent2Phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nationality</label>
                        {editing ? (
                          <input
                            type="text"
                            value={editData.parent2Nationality || ''}
                            onChange={(e) => setEditData({...editData, parent2Nationality: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{student.parent2Nationality || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Employment Status</label>
                        {editing ? (
                          <select
                            value={editData.parent2EmploymentStatus || ''}
                            onChange={(e) => setEditData({...editData, parent2EmploymentStatus: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="employed">Employed</option>
                            <option value="self-employed">Self-employed</option>
                            <option value="retired">Retired</option>
                            <option value="unemployed">Unemployed</option>
                          </select>
                        ) : (
                          <p className="text-gray-900">{student.parent2EmploymentStatus || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                        {editing ? (
                          <input
                            type="number"
                            value={editData.parent2MonthlyIncome || ''}
                            onChange={(e) => setEditData({...editData, parent2MonthlyIncome: e.target.value})}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="SGD"
                          />
                        ) : (
                          <p className="text-gray-900">{student.parent2MonthlyIncome ? `SGD ${student.parent2MonthlyIncome}` : 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Passport Upload</label>
                    <p className="text-gray-900">{student.passportUpload ? 'Uploaded' : 'Not uploaded'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Birth Certificate (Original)</label>
                    <p className="text-gray-900">{student.birthCertificateOriginal ? 'Uploaded' : 'Not uploaded'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Birth Certificate (Notarised)</label>
                    <p className="text-gray-900">{student.birthCertificateNotarised ? 'Uploaded' : 'Not uploaded'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">School Result Slip (Latest)</label>
                    <p className="text-gray-900">{student.schoolResultSlipLatest ? 'Uploaded' : 'Not uploaded'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">School Result Slip (Past 2 Years)</label>
                    <p className="text-gray-900">{student.schoolResultSlipPast2Years ? 'Uploaded' : 'Not uploaded'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Letter of Referral</label>
                    <p className="text-gray-900">{student.letterOfReferral ? 'Uploaded' : 'Not uploaded'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 