import React from 'react';
import { Card, CardContent, CardHeader } from "../ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, description, trend, className = "", color = "bg-blue-100" }) {
  return (
    <div className={`relative overflow-hidden shadow-lg border-0 bg-white transition-all duration-300 w-full text-left hover:shadow-xl ${className}`}>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
              <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {description && (
              <p className="text-sm text-slate-600">{description}</p>
            )}
            {trend && (
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                <span className="text-slate-600">{trend}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 