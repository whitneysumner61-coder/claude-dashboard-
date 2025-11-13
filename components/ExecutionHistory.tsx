'use client';

import { useState, useEffect } from 'react';
import { formatDate, calculateDuration, cn, getStatusColor } from '@/lib/utils';
import type { ExecutionHistory as ExecutionHistoryType } from '@/types';

interface ExecutionHistoryProps {
  repositoryId: string;
}

export default function ExecutionHistory({ repositoryId }: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<ExecutionHistoryType[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadExecutions();
  }, [repositoryId]);

  const loadExecutions = async () => {
    try {
      const response = await fetch(`/api/repositories/${repositoryId}/executions`);
      if (response.ok) {
        const data = await response.json();
        setExecutions(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load executions:', error);
    }
  };

  const recentExecutions = isExpanded ? executions : executions.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Execution History</h2>
        {executions.length > 5 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {isExpanded ? 'Show Less' : `Show All (${executions.length})`}
          </button>
        )}
      </div>

      {executions.length === 0 ? (
        <div className="card text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-gray-500">No executions yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Execute a prompt to see its history here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentExecutions.map((execution) => (
            <div
              key={execution.id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {execution.promptTitle}
                    </h3>
                    <span
                      className={cn(
                        'status-badge',
                        getStatusColor(execution.status) === 'bg-green-500' &&
                          'bg-green-100 text-green-700',
                        getStatusColor(execution.status) === 'bg-blue-500' &&
                          'bg-blue-100 text-blue-700',
                        getStatusColor(execution.status) === 'bg-red-500' &&
                          'bg-red-100 text-red-700',
                        getStatusColor(execution.status) === 'bg-yellow-500' &&
                          'bg-yellow-100 text-yellow-700',
                        getStatusColor(execution.status) === 'bg-gray-500' &&
                          'bg-gray-100 text-gray-700'
                      )}
                    >
                      {execution.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>By {execution.userName}</span>
                    <span>{formatDate(execution.startTime)}</span>
                    {execution.duration && (
                      <span>
                        Duration:{' '}
                        {calculateDuration(
                          execution.startTime,
                          new Date(
                            execution.startTime.getTime() + execution.duration * 1000
                          )
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <button className="btn-secondary text-xs ml-4">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
