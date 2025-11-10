'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ExecutionData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CostChart, PerformanceChart, TokenChart, RadarChart } from '@/components/charts';
import { formatCurrency, formatNumber, getModelDisplayName } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, DollarSign, Zap } from 'lucide-react';

export default function ComparisonPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ExecutionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/executions/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching execution:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-gray-500">Loading comparison...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-gray-500">Execution not found</div>
        </div>
      </div>
    );
  }

  const results = Object.values(data.responses).filter((r) => !r.error);
  const cheapest = results.reduce((min, r) => 
    (r.cost || Infinity) < (min.cost || Infinity) ? r : min, results[0]
  );
  const fastest = results.reduce((min, r) => 
    (r.latency || Infinity) < (min.latency || Infinity) ? r : min, results[0]
  );
  const mostEfficient = results.reduce((min, r) => {
    const efficiency = (r.totalTokens || 0) / (r.cost || 1);
    const minEfficiency = (min.totalTokens || 0) / (min.cost || 1);
    return efficiency > minEfficiency ? r : min;
  }, results[0]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/executions/${id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Execution
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Model Comparison Analysis
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Detailed comparison of AI model performance
          </p>
        </div>

        {/* Recommendations */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Cheapest Model
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {getModelDisplayName(cheapest.model)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(cheapest.cost || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Fastest Model
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {getModelDisplayName(fastest.model)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(fastest.latency || 0)}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Most Efficient
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {getModelDisplayName(mostEfficient.model)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(mostEfficient.totalTokens || 0)} tokens/$
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <CostChart data={results} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={results} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Token Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <TokenChart data={results} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Multi-Dimensional Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChart data={results} />
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Model
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cost
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Latency
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Input Tokens
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Output Tokens
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Tokens
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.model}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getModelDisplayName(result.model)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(result.cost || 0)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(result.latency || 0)}ms
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(result.inputTokens || 0)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(result.outputTokens || 0)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(result.totalTokens || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


