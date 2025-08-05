import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft, Search, Filter, Download, Upload, Edit, Eye, Users } from "lucide-react";

async function getStudentsData() {
  try {
    const response = await fetch('http://localhost:3000/api/students', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

function getFilteredStudents(students, category) {
  switch (category) {
    case 'total':
      return students;
    case 'early-stages':
      const earlyStages = ['consultation', 'engagement', 'data_collection', 'data_enhancement'];
      return students.filter(student => earlyStages.includes(student.current_stage));
    case 'application-process':
      const appStages = ['exam_preparation', 'file_application', 'entrance_exam', 'offer_rejection', 'student_contract'];
      return students.filter(student => appStages.includes(student.current_stage));
    case 'immigration-process':
      const immStages = ['stp_application', 'travel_arrangement', 'landing', 'stp_collection', 'ltvp_application', 'ltvp_collection'];
      return students.filter(student => immStages.includes(student.current_stage));
    case 'completed':
      return students.filter(student => student.current_stage === 'case_close_plan_b');
    case 'tier1-aspirants':
      return students.filter(student => student.isTier1Aspirant);
    default:
      return students;
  }
}

function getCategoryTitle(category) {
  switch (category) {
    case 'total':
      return 'Total Students';
    case 'early-stages':
      return 'Early Stages (Consultation to Data Enhancement)';
    case 'application-process':
      return 'Application Process (Exam Prep to Contract)';
    case 'immigration-process':
      return 'Immigration Process (STP to LTVP Collection)';
    case 'completed':
      return 'Completed Cases';
    case 'tier1-aspirants':
      return 'Tier 1 Aspirants';
    default:
      return 'Students';
  }
}

function getStageLabel(stage) {
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
}

export default async function StudentListPage({ params }) {
  const students = await getStudentsData();
  const filteredStudents = getFilteredStudents(students, params.category);
  const categoryTitle = getCategoryTitle(params.category);

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
              <h1 className="text-xl font-bold text-gray-900">{categoryTitle}</h1>
              <p className="text-sm text-gray-600">{filteredStudents.length} students</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{student.studentEmail}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nationality:</span>
                  <span className="font-medium">{student.nationality}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Education:</span>
                  <span className="font-medium">{student.educationType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-medium">{student.grade_applying_for}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Stage:</span>
                  <span className="font-medium text-blue-600">
                    {getStageLabel(student.current_stage)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Join Date:</span>
                  <span className="font-medium">{new Date(student.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Target Tier:</span>
                  <span className="font-medium">{student.targetTier}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Tier:</span>
                  <span className="font-medium">{student.currentSchoolTier || 'Not specified'}</span>
                </div>
                {student.isTier1Aspirant && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Tier 1 Aspirant
                    </span>
                  </div>
                )}
                {student.siblingStudentId && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Sibling: ID {student.siblingStudentId}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">There are no students in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
} 