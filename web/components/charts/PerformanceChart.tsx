'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ModelResponse } from '@/lib/types';
import { formatDuration } from '@/lib/utils';

interface PerformanceChartProps {
  data: ModelResponse[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data
    .filter((d) => !d.error && d.latency !== undefined)
    .map((d) => ({
      model: d.model.split('/').pop()?.replace(/-/g, ' ') || d.model,
      latency: d.latency || 0,
    }))
    .sort((a, b) => a.latency - b.latency);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
        <XAxis
          dataKey="model"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fill: 'currentColor' }}
          tickFormatter={(value) => formatDuration(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => formatDuration(value)}
        />
        <Legend />
        <Bar dataKey="latency" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}


