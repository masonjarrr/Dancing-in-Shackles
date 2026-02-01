'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GaugeProps {
  label: string;
  value: number;
  color: string;
}

function SemiGauge({ label, value, color }: GaugeProps) {
  const data = [
    { value: value },
    { value: 100 - value },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-40 h-24 relative">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="hsl(240 3.7% 15.9%)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <span className="text-2xl font-bold">{value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DualGaugeProps {
  performanceScore: number;
  wellbeingScore: number;
}

export function DualGauge({ performanceScore, wellbeingScore }: DualGaugeProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SemiGauge label="Performance" value={performanceScore} color="hsl(220 70% 50%)" />
      <SemiGauge label="Wellbeing" value={wellbeingScore} color="hsl(160 60% 45%)" />
    </div>
  );
}
