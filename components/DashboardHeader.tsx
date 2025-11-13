'use client';

import { useState } from 'react';
import { cn, getStatusColor } from '@/lib/utils';

interface DashboardHeaderProps {
  onNewRepository: (name: string, description: string) => void;
  onConnectClaude: () => void;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export default function DashboardHeader({
  onNewRepository,
  onConnectClaude,
  connectionStatus,
}: DashboardHeaderProps) {
  const [showNewRepoModal, setShowNewRepoModal] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [repoDescription, setRepoDescription] = useState('');

  const handleCreateRepository = () => {
    if (repoName.trim()) {
      onNewRepository(repoName.trim(), repoDescription.trim());
      setRepoName('');
      setRepoDescription('');
      setShowNewRepoModal(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">AutoFlow Commander</h1>
            <span className="text-sm text-gray-500">
              Interactive Automation Management Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Claude Connection Status */}
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  getStatusColor(connectionStatus)
                )}
              />
              <span className="text-sm text-gray-600 capitalize">
                {connectionStatus}
              </span>
            </div>

            {/* Connect to Claude Button */}
            {connectionStatus === 'disconnected' && (
              <button onClick={onConnectClaude} className="btn-primary">
                Connect to Claude
              </button>
            )}

            {/* New Repository Button */}
            <button
              onClick={() => setShowNewRepoModal(true)}
              className="btn-primary"
            >
              + New Repository
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* New Repository Modal */}
      {showNewRepoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create New Repository
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="repo-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Repository Name
                </label>
                <input
                  id="repo-name"
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="input"
                  placeholder="my-automation-project"
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="repo-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description (optional)
                </label>
                <textarea
                  id="repo-description"
                  value={repoDescription}
                  onChange={(e) => setRepoDescription(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Describe your automation repository..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewRepoModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRepository}
                className="btn-primary"
                disabled={!repoName.trim()}
              >
                Create Repository
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
