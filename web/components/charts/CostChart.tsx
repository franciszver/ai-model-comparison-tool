'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ModelResponse } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface CostChartProps {
  data: ModelResponse[];
}

export function CostChart({ data }: CostChartProps) {
  const chartData = data
    .filter((d) => !d.error && d.cost !== undefined)
    .map((d) => ({
      model: d.model.split('/').pop()?.replace(/-/g, ' ') || d.model,
      cost: d.cost || 0,
    }))
    .sort((a, b) => b.cost - a.cost);

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
          tickFormatter={(value) => `$${value.toFixed(4)}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend />
        <Bar dataKey="cost" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}


