'use client';

import { useState } from 'react';
import { ModelResponse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatNumber, formatDuration, getModelDisplayName } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResponseViewerProps {
  responses: ModelResponse[];
}

export function ResponseViewer({ responses }: ResponseViewerProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (model: string) => {
    setExpanded((prev) => ({
      ...prev,
      [model]: !prev[model],
    }));
  };

  return (
    <div className="space-y-4">
      {responses.map((response) => {
        const isExpanded = expanded[response.model] || false;
        const displayName = getModelDisplayName(response.model);

        return (
          <Card key={response.model}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>{displayName}</CardTitle>
                  {response.error ? (
                    <Badge variant="error">Error</Badge>
                  ) : (
                    <Badge variant="success">Success</Badge>
                  )}
                </div>
                <button
                  onClick={() => toggleExpanded(response.model)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {response.error ? (
                <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <p className="font-medium">Error:</p>
                  <p className="mt-1">{response.error}</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {response.cost ? formatCurrency(response.cost) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Latency</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {response.latency ? formatDuration(response.latency) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tokens</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {response.totalTokens ? formatNumber(response.totalTokens) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Length</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {response.response ? formatNumber(response.response.length) : 'N/A'} chars
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Response:</p>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <p className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
                        {isExpanded
                          ? response.response
                          : response.response.substring(0, 500) + (response.response.length > 500 ? '...' : '')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


