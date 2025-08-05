import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Globe } from "lucide-react";

export default function CountryBreakdown({ students, isLoading }) {
  const getCountryStats = () => {
    const countries = {};
    students.forEach(student => {
      if (student.nationality) {
        countries[student.nationality] = (countries[student.nationality] || 0) + 1;
      }
    });
    return Object.entries(countries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const countryStats = getCountryStats();
  const totalStudents = students.length;

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <Globe className="w-5 h-5" />
          Top Countries
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {countryStats.map(([country, count]) => (
          <div key={country} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {country.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-800">{country}</p>
                <p className="text-sm text-slate-500">
                  {((count / totalStudents) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-500">students</p>
            </div>
          </div>
        ))}
        
        {countryStats.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No student data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 