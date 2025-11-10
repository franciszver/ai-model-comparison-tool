'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DollarSign, Zap, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils';
import { ExecutionListItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function Home() {
  const [executions, setExecutions] = useState<ExecutionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/executions')
      .then((res) => res.json())
      .then((data) => {
        setExecutions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching executions:', err);
        setLoading(false);
      });
  }, []);

  const totalCost = executions.reduce((sum, e) => sum + e.totalCost, 0);
  const avgLatency = executions.length > 0
    ? executions.reduce((sum, e) => sum + e.avgLatency, 0) / executions.length
    : 0;
  const totalExecutions = executions.length;
  const totalModels = executions.reduce((sum, e) => sum + e.models, 0);

  const recentExecutions = executions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            AI Model Comparison Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Analyze cost, performance, and quality across multiple AI models
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Cost"
            value={formatCurrency(totalCost)}
            subtitle="Across all executions"
            icon={<DollarSign className="h-6 w-6" />}
          />
          <MetricCard
            title="Average Latency"
            value={`${Math.round(avgLatency)}ms`}
            subtitle="Response time"
            icon={<Zap className="h-6 w-6" />}
          />
          <MetricCard
            title="Total Executions"
            value={formatNumber(totalExecutions)}
            subtitle="Comparisons performed"
            icon={<Activity className="h-6 w-6" />}
          />
          <MetricCard
            title="Models Compared"
            value={formatNumber(totalModels)}
            subtitle="Total model runs"
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Recent Executions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Executions</CardTitle>
              <Link
                href="/executions"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : recentExecutions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No executions found. Run a comparison to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {recentExecutions.map((execution) => (
                  <Link
                    key={execution.folderName}
                    href={`/executions/${execution.folderName}`}
                    className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {execution.lotUrl}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(execution.timestamp)} • {execution.models} models
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(execution.totalCost)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.round(execution.avgLatency)}ms
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
