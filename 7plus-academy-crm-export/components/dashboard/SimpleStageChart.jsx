'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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

const stageCategories = {
  early: ['consultation', 'engagement', 'data_collection', 'data_enhancement'],
  application: ['exam_preparation', 'file_application', 'entrance_exam', 'offer_rejection', 'student_contract'],
  immigration: ['stp_application', 'travel_arrangement', 'landing', 'stp_collection', 'ltvp_application', 'ltvp_collection'],
  completed: ['case_close_plan_b', 'completed', 'pending_tier_1_upgrade']
};

export default function SimpleStageChart({ stageCounts, isLoading }) {
  const chartData = Object.entries(stageLabels).map(([stageKey, stageLabel]) => ({
    stage: stageLabel,
    count: stageCounts[stageKey] || 0,
    category: Object.keys(stageCategories).find(cat => stageCategories[cat].includes(stageKey))
  })).filter(item => item.count > 0);

  const getBarColor = (category) => {
    switch(category) {
      case 'early': return 'bg-cyan-500';
      case 'application': return 'bg-amber-500';
      case 'immigration': return 'bg-emerald-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const maxCount = Math.max(...chartData.map(item => item.count), 1);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">Application Stage Overview</CardTitle>
        <div className="flex flex-wrap gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span>Early Stages (1-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span>Application (5-9)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span>Immigration (10-15)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Completed & On-going</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{item.stage}</span>
                <span className="text-slate-600">{item.count}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getBarColor(item.category)}`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 