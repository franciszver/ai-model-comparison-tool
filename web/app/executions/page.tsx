'use client';

import { useEffect, useState } from 'react';
import { ExecutionListItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatRelativeTime, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<ExecutionListItem[]>([]);
  const [filteredExecutions, setFilteredExecutions] = useState<ExecutionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'latency'>('date');

  useEffect(() => {
    fetch('/api/executions')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        const executionsList = Array.isArray(data) ? data : [];
        setExecutions(executionsList);
        setFilteredExecutions(executionsList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching executions:', err);
        setExecutions([]);
        setFilteredExecutions([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...executions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.lotUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.folderName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return b.totalCost - a.totalCost;
        case 'latency':
          return a.avgLatency - b.avgLatency;
        case 'date':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    setFilteredExecutions(filtered);
  }, [executions, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Executions</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browse and analyze all model comparison executions
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search executions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'cost' | 'latency')}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="date">Sort by Date</option>
                  <option value="cost">Sort by Cost</option>
                  <option value="latency">Sort by Latency</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading executions...</div>
        ) : filteredExecutions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {searchQuery ? 'No executions match your search.' : 'No executions found.'}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredExecutions.map((execution) => (
              <Link
                key={execution.folderName}
                href={`/executions/${execution.folderName}`}
                className="block"
              >
                <Card className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {execution.lotUrl}
                          </h3>
                          <Badge variant="info">{execution.models} models</Badge>
                          {execution.successful === execution.models && (
                            <Badge variant="success">All successful</Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(execution.timestamp)} • {formatRelativeTime(execution.timestamp)}
                        </p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(execution.totalCost)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Avg: {Math.round(execution.avgLatency)}ms
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


