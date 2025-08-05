import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, UserPlus, FileText, TrendingUp, MessageSquare, BookOpen, Plane, Award } from "lucide-react";

import StatsCard from "../../components/dashboard/StatsCard";
import RecentApplications from "../../components/dashboard/RecentApplications";
import SimpleStageChart from "../../components/dashboard/SimpleStageChart";
import SchoolRecommendation from "../../components/dashboard/SchoolRecommendation";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AuthGuard from "../../components/auth/AuthGuard";

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

export default async function Dashboard() {
  const students = await getStudentsData()
  
  const getStageCounts = () => {
    const counts = {};
    students.forEach(student => {
      const stage = student.current_stage || 'consultation';
      counts[stage] = (counts[stage] || 0) + 1;
    });
    return counts;
  };

  const getRecentStudents = () => {
    return students
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 5);
  };

  const getEarlyStageCount = () => {
    const earlyStages = ['consultation', 'engagement', 'data_collection', 'data_enhancement'];
    return students.filter(student => earlyStages.includes(student.current_stage)).length;
  };

  const getApplicationProcessCount = () => {
    const appStages = ['exam_preparation', 'file_application', 'entrance_exam', 'offer_rejection', 'student_contract'];
    return students.filter(student => appStages.includes(student.current_stage)).length;
  };

  const getImmigrationProcessCount = () => {
    const immStages = ['stp_application', 'travel_arrangement', 'landing', 'stp_collection', 'ltvp_application', 'ltvp_collection'];
    return students.filter(student => immStages.includes(student.current_stage)).length;
  };

  const getCompletedCount = () => {
    return students.filter(student => student.current_stage === 'case_close_plan_b').length;
  };

  const getTier1AspirantsCount = () => {
    // Tier 1 aspirants are students who want Tier 1 but are in stages 1-15 (not completed)
    return students.filter(student => 
      student.isTier1Aspirant && 
      student.current_stage !== 'case_close_plan_b'
    ).length;
  };

  const stageCounts = getStageCounts();

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
            {/* Stats Cards - Clickable */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/dashboard/students/total">
                <StatsCard
                  title="Total Students"
                  value={getEarlyStageCount() + getApplicationProcessCount() + getImmigrationProcessCount() + getCompletedCount()}
                  icon={Users}
                  description="Sum of all active and completed cases"
                  trend="+12% from last month"
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </Link>
              
              <Link href="/dashboard/students/early-stages">
                <StatsCard
                  title="Early Stages"
                  value={getEarlyStageCount()}
                  icon={BookOpen}
                  description="Consultation to Data Enhancement"
                  trend="+5% from last month"
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </Link>
              
              <Link href="/dashboard/students/application-process">
                <StatsCard
                  title="Application Process"
                  value={getApplicationProcessCount()}
                  icon={FileText}
                  description="Exam Prep to Contract"
                  trend="+8% from last month"
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </Link>
              
              <Link href="/dashboard/students/immigration-process">
                <StatsCard
                  title="Immigration Process"
                  value={getImmigrationProcessCount()}
                  icon={Plane}
                  description="STP to LTVP Collection"
                  trend="+3% from last month"
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </Link>
              
              <Link href="/dashboard/students/completed">
                <StatsCard
                  title="Completed Cases"
                  value={getCompletedCount()}
                  icon={Award}
                  description="Successfully closed"
                  trend="+15% from last month"
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </Link>
              

            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <SimpleStageChart stageCounts={stageCounts} isLoading={false} />
            </div>

            {/* AI School Recommendations */}
            <div className="mt-8">
              <SchoolRecommendation students={students} />
            </div>

            {/* Recent Applications */}
            <RecentApplications students={getRecentStudents()} />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  } 