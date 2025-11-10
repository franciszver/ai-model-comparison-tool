'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, trend, icon }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                {trend && (
                  <span
                    className={`text-sm font-medium ${
                      trend.isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {trend.isPositive ? '+' : ''}
                    {trend.value}%
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
              )}
            </div>
            {icon && (
              <div className="ml-4 text-gray-400 dark:text-gray-600">{icon}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


