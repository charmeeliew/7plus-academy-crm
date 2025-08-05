'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stageCategories = {
  early: ['consultation', 'engagement', 'data_collection', 'data_enhancement'],
  application: ['exam_preparation', 'file_application', 'entrance_exam', 'offer_rejection', 'student_contract'],
  immigration: ['stp_application', 'travel_arrangement', 'landing', 'stp_collection', 'ltvp_application', 'ltvp_collection'],
  completed: ['case_close_plan_b', 'completed', 'pending_tier_1_upgrade']
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

export default function StageBreakdown({ stageCounts, isLoading }) {
  const chartData = Object.entries(stageLabels).map(([stageKey, stageLabel]) => ({
    stage: stageLabel,
    count: stageCounts[stageKey] || 0,
    category: Object.keys(stageCategories).find(cat => stageCategories[cat].includes(stageKey))
  })).filter(item => item.count > 0);

  const getBarColor = (category) => {
    switch(category) {
      case 'early': return '#06b6d4'; // cyan
      case 'application': return '#f59e0b'; // amber
      case 'immigration': return '#10b981'; // emerald
      case 'completed': return '#6b7280'; // gray
      default: return '#3b82f6';
    }
  };

  // Add error boundary for chart rendering
  try {
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
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="stage" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                    <Bar key={`cell-${index}`} fill={getBarColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  } catch (error) {
    // Fallback if chart fails to render
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Application Stage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <p className="text-lg font-medium">Chart Loading...</p>
              <p className="text-sm">Please wait while the chart loads</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
} 