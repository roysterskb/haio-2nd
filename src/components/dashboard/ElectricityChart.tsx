"use client"

import { useDashboardData } from '@/hooks/useDashboardData';
import { BarChart3, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ElectricityChart = ({ className = '' }: { className?: string }) => {
  const { energyData } = useDashboardData();

  const labels = ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM'];
  const data = energyData.hourlyUsage.slice(0, 12);

  return (
    <Card className={`w-full h-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <CardTitle className="text-lg">Electricity Usage</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Current: {energyData.current} kWh</span>
            <span>Today: {energyData.today} kWh</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              {labels.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
            <div className="flex gap-1 h-20">
              {(data || []).map((value, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/20 rounded-b" 
                  style={{ height: `${(value / Math.max(...data, 1)) * 100}%` }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-between text-sm font-medium">
            <span>Savings: {energyData.savings}%</span>
            <span className="text-primary">View Details</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};