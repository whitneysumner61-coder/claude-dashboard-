'use client';

import { cn, formatDate, getComplexityColor } from '@/lib/utils';
import type { AutomationPrompt } from '@/types';

interface PromptCardProps {
  prompt: AutomationPrompt;
  isSelected: boolean;
  onSelect: (prompt: AutomationPrompt) => void;
  onExecute: (promptId: string) => void;
  onEdit: (prompt: AutomationPrompt) => void;
  onDelete: (promptId: string) => void;
}

export default function PromptCard({
  prompt,
  isSelected,
  onSelect,
  onExecute,
  onEdit,
  onDelete,
}: PromptCardProps) {
  return (
    <div
      className={cn('prompt-card', isSelected && 'selected')}
      onClick={() => onSelect(prompt)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 flex-1">
          {prompt.title}
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExecute(prompt.id);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Execute"
          >
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt.id);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete"
          >
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {prompt.content.substring(0, 100)}...
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {prompt.category}
        </span>
        <span className={cn('complexity-badge text-xs', getComplexityColor(prompt.complexity))}>
          {prompt.complexity}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
          ~{prompt.estimatedRuntime}s
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>v{prompt.version}</span>
        <span>{prompt.executionCount} executions</span>
        <span>{Math.round(prompt.successRate * 100)}% success</span>
      </div>

      <div className="text-xs text-gray-400 mt-2">
        Updated {formatDate(prompt.lastModified)}
      </div>
    </div>
  );
}
