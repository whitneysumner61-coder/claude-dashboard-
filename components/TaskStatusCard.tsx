'use client';

import { useEffect, useState } from 'react';
import { cn, formatDate, calculateDuration, getStatusColor } from '@/lib/utils';
import type { ActiveTask, TaskLog } from '@/types';

interface TaskStatusCardProps {
  task: ActiveTask;
  onCancel?: (taskId: string) => void;
  onRetry?: (taskId: string) => void;
}

export default function TaskStatusCard({
  task,
  onCancel,
  onRetry,
}: TaskStatusCardProps) {
  const [logs, setLogs] = useState<TaskLog[]>(task.logs || []);
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {task.prompt.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={cn(
                'status-badge',
                getStatusColor(task.status) === 'bg-green-500' && 'bg-green-100 text-green-700',
                getStatusColor(task.status) === 'bg-blue-500' && 'bg-blue-100 text-blue-700',
                getStatusColor(task.status) === 'bg-red-500' && 'bg-red-100 text-red-700',
                getStatusColor(task.status) === 'bg-yellow-500' && 'bg-yellow-100 text-yellow-700',
                getStatusColor(task.status) === 'bg-gray-500' && 'bg-gray-100 text-gray-700'
              )}
            >
              {task.status}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {task.status === 'running' && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-medium text-gray-900">
              {task.progress}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Task Details */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Started:</span>
          <span className="text-gray-900">{formatDate(task.startTime)}</span>
        </div>
        {task.endTime && (
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="text-gray-900">
              {calculateDuration(task.startTime, task.endTime)}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Resources:</span>
          <span className="text-gray-900">
            {task.resourcesAllocated.cpu}% CPU, {task.resourcesAllocated.memory}MB RAM
          </span>
        </div>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {showLogs ? 'Hide Logs' : `Show Logs (${logs.length})`}
          </button>

          {showLogs && (
            <div className="log-viewer mt-2">
              {logs.map((log) => (
                <div key={log.id} className="mb-1">
                  <span className="text-gray-500">
                    [{formatDate(log.timestamp)}]
                  </span>{' '}
                  <span
                    className={cn(
                      log.level === 'error' && 'text-red-400',
                      log.level === 'warn' && 'text-yellow-400',
                      log.level === 'info' && 'text-blue-400',
                      log.level === 'debug' && 'text-gray-400'
                    )}
                  >
                    {log.level.toUpperCase()}
                  </span>
                  : {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2 mt-3">
        {task.status === 'running' && onCancel && (
          <button
            onClick={() => onCancel(task.id)}
            className="btn-danger text-xs flex-1"
          >
            Cancel
          </button>
        )}
        {(task.status === 'failed' || task.status === 'cancelled') && onRetry && (
          <button
            onClick={() => onRetry(task.id)}
            className="btn-primary text-xs flex-1"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
