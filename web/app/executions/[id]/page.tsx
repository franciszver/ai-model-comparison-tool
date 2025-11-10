'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ExecutionData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CostChart, PerformanceChart, TokenChart } from '@/components/charts';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatNumber, formatDate, getModelDisplayName } from '@/lib/utils';
import { ImageGallery } from '@/components/ImageGallery';
import { ResponseViewer } from '@/components/ResponseViewer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExecutionDetailPage() {
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
          <div className="text-center py-12 text-gray-500">Loading execution details...</div>
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

  const results = Object.values(data.responses).map((r) => r);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/executions"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Executions
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Execution Details
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {formatDate(data.config.timestamp)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(data.summary.totalCost)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tokens</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(data.summary.totalTokens)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Latency</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(data.summary.avgLatency)}ms
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {data.summary.successful}/{data.summary.models}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lot Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lot Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</p>
                <p className="text-gray-900 dark:text-gray-100">{data.lotData.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</p>
                <p className="text-gray-900 dark:text-gray-100">{data.lotData.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">URL</p>
                <a
                  href={data.lotData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {data.lotData.url}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

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
        </div>

        {/* Model Responses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Model Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponseViewer responses={results} />
          </CardContent>
        </Card>

        {/* Images */}
        {data.lotData.images && data.lotData.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={data.lotData.images}
                executionId={id}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


