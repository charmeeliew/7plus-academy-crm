'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Search, Filter, Download, Upload, Edit, Eye, Plus, Save, X } from "lucide-react";
import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function StudentsTablePage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

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

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditData(student);
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the student
      const updatedStudents = students.map(student =>
        student.id === editingId ? { ...student, ...editData } : student
      );
      setStudents(updatedStudents);
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,First Name,Last Name,Email,Nationality,Education Type,Grade,Stage,Join Date\n" +
      filteredStudents.map(student => 
        `${student.id},"${student.first_name}","${student.last_name}","${student.studentEmail}","${student.nationality}","${student.educationType}","${student.grade_applying_for}","${student.current_stage}","${student.joinDate}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        try {
          // Parse CSV
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const importedStudents = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
              const student = {};
              
              headers.forEach((header, index) => {
                student[header] = values[index] || '';
              });
              
              // Add default values for missing fields
              if (!student.current_stage) student.current_stage = 'consultation';
              if (!student.joinDate) student.joinDate = new Date().toISOString().split('T')[0];
              if (!student.id) student.id = Date.now() + i;
              
              importedStudents.push(student);
            }
          }
          
          // Update students state
          setStudents(prev => [...prev, ...importedStudents]);
          setFilteredStudents(prev => [...prev, ...importedStudents]);
          
          alert(`Successfully imported ${importedStudents.length} students`);
        } catch (error) {
          console.error('Error importing CSV:', error);
          alert('Error importing CSV file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
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
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students Data Table</h1>
            <p className="text-sm text-gray-600">{filteredStudents.length} students</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </span>
              </Button>
            </label>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/form">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </Link>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 max-w-md">
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
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Grade Filter */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Grade:</label>
              <select
                onChange={(e) => {
                  const grade = e.target.value;
                  if (grade) {
                    setFilteredStudents(students.filter(student => student.grade_applying_for === grade));
                  } else {
                    setFilteredStudents(students);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Grades</option>
                <option value="pre_kg">Pre-KG</option>
                <option value="kg1">KG1</option>
                <option value="kg2">KG2</option>
                <option value="grade_1">Grade 1</option>
                <option value="grade_2">Grade 2</option>
                <option value="grade_3">Grade 3</option>
                <option value="grade_4">Grade 4</option>
                <option value="grade_5">Grade 5</option>
                <option value="grade_6">Grade 6</option>
                <option value="grade_7">Grade 7</option>
                <option value="grade_8">Grade 8</option>
                <option value="grade_9">Grade 9</option>
                <option value="grade_10">Grade 10</option>
                <option value="grade_11">Grade 11</option>
                <option value="grade_12">Grade 12</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Nationality</th>
                    <th className="px-6 py-3">Education</th>
                    <th className="px-6 py-3">Grade</th>
                    <th className="px-6 py-3">Stage</th>
                    <th className="px-6 py-3">Join Date</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editData.first_name || ''}
                            onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          `${student.first_name} ${student.last_name}`
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === student.id ? (
                          <input
                            type="email"
                            value={editData.studentEmail || ''}
                            onChange={(e) => setEditData({...editData, studentEmail: e.target.value})}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          student.studentEmail
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editData.nationality || ''}
                            onChange={(e) => setEditData({...editData, nationality: e.target.value})}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          student.nationality
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === student.id ? (
                          <select
                            value={editData.educationType || ''}
                            onChange={(e) => setEditData({...editData, educationType: e.target.value})}
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="K-12 School">K-12 School</option>
                            <option value="University">University</option>
                          </select>
                        ) : (
                          student.educationType
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editData.grade_applying_for || ''}
                            onChange={(e) => setEditData({...editData, grade_applying_for: e.target.value})}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          student.grade_applying_for
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === student.id ? (
                          <select
                            value={editData.current_stage || ''}
                            onChange={(e) => setEditData({...editData, current_stage: e.target.value})}
                            className="border rounded px-2 py-1 w-full"
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
                          <span className="text-blue-600 font-medium">
                            {student.current_stage}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === student.id ? (
                          <input
                            type="date"
                            value={editData.joinDate || ''}
                            onChange={(e) => setEditData({...editData, joinDate: e.target.value})}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          new Date(student.joinDate).toLocaleDateString()
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {editingId === student.id ? (
                            <>
                              <Button size="sm" onClick={handleSave}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Link href={`/students/${student.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(student)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 