'use client';

import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ModelResponse } from '@/lib/types';

interface RadarChartProps {
  data: ModelResponse[];
}

export function RadarChart({ data }: RadarChartProps) {
  const successfulData = data.filter((d) => !d.error);

  if (successfulData.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Normalize data for radar chart (0-100 scale)
  const maxCost = Math.max(...successfulData.map((d) => d.cost || 0));
  const maxLatency = Math.max(...successfulData.map((d) => d.latency || 0));
  const maxTokens = Math.max(...successfulData.map((d) => d.totalTokens || 0));

  const chartData = successfulData.map((d) => ({
    model: d.model.split('/').pop()?.replace(/-/g, ' ') || d.model,
    'Cost Efficiency': maxCost > 0 ? ((maxCost - (d.cost || 0)) / maxCost) * 100 : 50,
    'Speed': maxLatency > 0 ? ((maxLatency - (d.latency || 0)) / maxLatency) * 100 : 50,
    'Token Efficiency': maxTokens > 0 ? ((maxTokens - (d.totalTokens || 0)) / maxTokens) * 100 : 50,
  }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid className="stroke-gray-200 dark:stroke-gray-800" />
        <PolarAngleAxis
          dataKey="model"
          tick={{ fill: 'currentColor', fontSize: 12 }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'currentColor' }} />
        {chartData.map((_, index) => (
          <Radar
            key={index}
            name={chartData[index].model}
            dataKey={chartData[index].model}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.3}
          />
        ))}
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}


