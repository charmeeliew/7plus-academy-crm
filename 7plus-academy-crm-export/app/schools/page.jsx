'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  School,
  GraduationCap,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Award
} from 'lucide-react'

export default function SchoolsPage() {
  const [schools, setSchools] = useState([])
  const [filteredSchools, setFilteredSchools] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    tier: '',
    curriculum: '',
    enrollmentMonth: '',
    maxTuition: '',
    minAcademicScore: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    filterSchools()
  }, [schools, searchTerm, filters])

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools')
      const data = await response.json()
      setSchools(data)
      setFilteredSchools(data)
    } catch (error) {
      console.error('Error fetching schools:', error)
    }
  }

  const filterSchools = () => {
    let filtered = schools.filter(school => {
      // Search term filter
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          school.address.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Type filter
      const matchesType = !filters.type || school.type === filters.type
      
      // Tier filter
      const matchesTier = !filters.tier || school.tier === filters.tier
      
      // Curriculum filter
      const matchesCurriculum = !filters.curriculum || school.curriculum === filters.curriculum
      
      // Enrollment month filter
      const matchesEnrollmentMonth = !filters.enrollmentMonth || school.enrollmentMonth === filters.enrollmentMonth
      
      // Tuition fee filter
      const matchesTuition = !filters.maxTuition || school.tuitionFee <= parseInt(filters.maxTuition)
      
      // Academic score filter
      const matchesAcademicScore = !filters.minAcademicScore || school.academicScore >= parseInt(filters.minAcademicScore)
      
      return matchesSearch && matchesType && matchesTier && matchesCurriculum && 
             matchesEnrollmentMonth && matchesTuition && matchesAcademicScore
    })
    
    setFilteredSchools(filtered)
  }

  const exportToCSV = () => {
    const headers = [
      'ID', 'Name', 'Type', 'Tier', 'Intake', 'Founding Year', 'Nationalities',
      'EAL Assistance', 'Grades Accepted', 'Curriculum', 'Address', 'Academic Score',
      'Tuition Fee', 'Enrollment Month'
    ]
    
    const csvContent = [
      headers.join(','),
      ...filteredSchools.map(school => [
        school.id,
        `"${school.name}"`,
        school.type,
        school.tier,
        school.intake,
        school.foundingYear,
        `"${school.nationalities.join(', ')}"`,
        school.ealAssistance ? 'Yes' : 'No',
        `"${school.gradesAccepted.join(', ')}"`,
        school.curriculum,
        `"${school.address}"`,
        school.academicScore,
        school.tuitionFee,
        school.enrollmentMonth
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schools_data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

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
          const importedSchools = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
              const school = {};
              
              headers.forEach((header, index) => {
                school[header] = values[index] || '';
              });
              
              // Add default values for missing fields
              if (!school.id) school.id = Date.now() + i;
              if (!school.type) school.type = 'K-12';
              if (!school.tier) school.tier = 'Tier 2';
              if (!school.ealAssistance) school.ealAssistance = true;
              if (!school.nationalities) school.nationalities = ['Singapore'];
              if (!school.gradesAccepted) school.gradesAccepted = ['Grade 1'];
              
              importedSchools.push(school);
            }
          }
          
          // Update schools state
          setSchools(prev => [...prev, ...importedSchools]);
          setFilteredSchools(prev => [...prev, ...importedSchools]);
          
          alert(`Successfully imported ${importedSchools.length} schools`);
        } catch (error) {
          console.error('Error importing CSV:', error);
          alert('Error importing CSV file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Tier 1': return 'bg-green-100 text-green-800'
      case 'Tier 2': return 'bg-blue-100 text-blue-800'
      case 'Tier 3': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'K-12': return 'bg-purple-100 text-purple-800'
      case 'University': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schools Database</h1>
            <p className="text-gray-600">Manage and filter school information</p>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
              id="import-csv"
            />
            <label htmlFor="import-csv">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </span>
              </Button>
            </label>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Schools
              </label>
              <Input
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="K-12">K-12 Schools</option>
                <option value="University">Universities</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tier
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum
              </label>
              <select
                value={filters.curriculum}
                onChange={(e) => setFilters({...filters, curriculum: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Curriculums</option>
                <option value="IB">IB</option>
                <option value="British">British</option>
                <option value="American">American</option>
                <option value="Australian">Australian</option>
                <option value="Singapore">Singapore</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="German">German</option>
                <option value="French">French</option>
                <option value="Dutch">Dutch</option>
                <option value="Swiss">Swiss</option>
                <option value="Indian">Indian</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Month
              </label>
              <select
                value={filters.enrollmentMonth}
                onChange={(e) => setFilters({...filters, enrollmentMonth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Months</option>
                <option value="January">January</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="August">August</option>
                <option value="September">September</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tuition Fee (SGD)
              </label>
              <Input
                type="number"
                placeholder="e.g., 30000"
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
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredSchools.length} of {schools.length} schools
        </p>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{school.name}</CardTitle>
                  <div className="flex gap-2 mb-2">
                    <Badge className={getTypeColor(school.type)}>
                      {school.type === 'K-12' ? <School className="w-3 h-3 mr-1" /> : <GraduationCap className="w-3 h-3 mr-1" />}
                      {school.type}
                    </Badge>
                    <Badge className={getTierColor(school.tier)}>
                      <Award className="w-3 h-3 mr-1" />
                      {school.tier}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Intake: {school.intake}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Founded: {school.foundingYear}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Fee: ${school.tuitionFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Score: {school.academicScore}</span>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                  <span className="text-gray-600">{school.address}</span>
                </div>
              </div>
              
              <div className="text-sm">
                <p><strong>Curriculum:</strong> {school.curriculum}</p>
                <p><strong>Enrollment:</strong> {school.enrollmentMonth}</p>
                <p><strong>EAL Support:</strong> {school.ealAssistance ? 'Yes' : 'No'}</p>
              </div>
              
              <div className="text-sm">
                <p><strong>Grades:</strong> {school.gradesAccepted.slice(0, 3).join(', ')}...</p>
                <p><strong>Nationalities:</strong> {school.nationalities.slice(0, 3).join(', ')}...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
      </div>
    </DashboardLayout>
  )
} 