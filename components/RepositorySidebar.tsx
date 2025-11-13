'use client';

import { cn, formatDate } from '@/lib/utils';
import type { AutomationRepository } from '@/types';

interface RepositorySidebarProps {
  repositories: AutomationRepository[];
  selectedRepo: AutomationRepository | null;
  onRepoSelect: (repo: AutomationRepository) => void;
  onRepoCreate: (name: string, description: string) => void;
}

export default function RepositorySidebar({
  repositories,
  selectedRepo,
  onRepoSelect,
}: RepositorySidebarProps) {
  return (
    <aside className="sidebar">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Repositories</h2>
        <p className="text-xs text-gray-500 mt-1">
          {repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'}
        </p>
      </div>

      <div className="p-2">
        {repositories.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No repositories yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Create your first repository to get started
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {repositories.map((repo) => (
              <button
                key={repo.id}
                onClick={() => onRepoSelect(repo)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-colors',
                  selectedRepo?.id === repo.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {repo.name}
                    </h3>
                    {repo.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {repo.prompts?.length || 0} prompts
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          repo.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : repo.status === 'archived'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-yellow-100 text-yellow-700'
                        )}
                      >
                        {repo.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Updated {formatDate(repo.updatedAt)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
