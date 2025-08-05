import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { User, Calendar, GraduationCap, Globe } from "lucide-react";

const stageColors = {
  consultation: "bg-cyan-100 text-cyan-800",
  engagement: "bg-cyan-100 text-cyan-800",
  data_collection: "bg-cyan-100 text-cyan-800",
  data_enhancement: "bg-cyan-100 text-cyan-800",
  exam_preparation: "bg-amber-100 text-amber-800",
  file_application: "bg-amber-100 text-amber-800",
  entrance_exam: "bg-amber-100 text-amber-800",
  offer_rejection: "bg-amber-100 text-amber-800",
  student_contract: "bg-amber-100 text-amber-800",
  stp_application: "bg-emerald-100 text-emerald-800",
  travel_arrangement: "bg-emerald-100 text-emerald-800",
  landing: "bg-emerald-100 text-emerald-800",
  stp_collection: "bg-emerald-100 text-emerald-800",
  ltvp_application: "bg-emerald-100 text-emerald-800",
  ltvp_collection: "bg-emerald-100 text-emerald-800",
  case_close_plan_b: "bg-gray-100 text-gray-800",
  pending_tier_1_upgrade: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800"
};

const stageLabels = {
  consultation: "Consultation",
  engagement: "Engagement",
  data_collection: "Data Collection",
  data_enhancement: "Data Enhancement",
  exam_preparation: "Exam Preparation",
  file_application: "File Application",
  entrance_exam: "Entrance Exam",
  offer_rejection: "Offer/Rejection",
  student_contract: "Student Contract",
  stp_application: "STP Application",
  travel_arrangement: "Travel Arrangement",
  landing: "Landing",
  stp_collection: "STP Collection",
  ltvp_application: "LTVP Application",
  ltvp_collection: "LTVP Collection",
  case_close_plan_b: "Case Close/Plan B"
};

export default function RecentApplications({ students, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800">Recent Applications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {students.map((student) => {
          const stageKey = student.current_stage || 'consultation';
          const stageNumber = Object.keys(stageLabels).indexOf(stageKey) + 1;
          
          return (
            <div key={student.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">
                    {student.first_name} {student.last_name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {student.nationality}
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {student.grade_applying_for?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(student.created_date), 'MMM d')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${stageColors[stageKey]} border-0 mb-1`}>
                  Stage {stageNumber > 0 ? stageNumber : ''}
                </Badge>
                <p className="text-xs text-slate-500">
                  {stageLabels[stageKey]}
                </p>
              </div>
            </div>
          )
        })}
        
        {students.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <User className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No recent applications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 