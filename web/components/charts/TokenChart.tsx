'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ModelResponse } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface TokenChartProps {
  data: ModelResponse[];
}

export function TokenChart({ data }: TokenChartProps) {
  const chartData = data
    .filter((d) => !d.error && d.totalTokens !== undefined)
    .map((d) => ({
      model: d.model.split('/').pop()?.replace(/-/g, ' ') || d.model,
      input: d.inputTokens || 0,
      output: d.outputTokens || 0,
      total: d.totalTokens || 0,
    }))
    .sort((a, b) => b.total - a.total);

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
          tickFormatter={(value) => formatNumber(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => formatNumber(value)}
        />
        <Legend />
        <Bar dataKey="input" stackId="a" fill="#6366f1" />
        <Bar dataKey="output" stackId="a" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
}


