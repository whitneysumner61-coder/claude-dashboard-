'use client';

import { useState } from 'react';

interface WelcomeScreenProps {
  onCreateRepository: (name: string, description: string) => void;
  onImportRepository: (url: string) => void;
}

export default function WelcomeScreen({
  onCreateRepository,
  onImportRepository,
}: WelcomeScreenProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const handleImport = () => {
    if (importUrl.trim()) {
      onImportRepository(importUrl.trim());
      setImportUrl('');
      setShowImportModal(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-2xl px-4">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AutoFlow Commander
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Interactive Automation Management Dashboard for Claude Code. Create, manage, and execute automation prompts with ease.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="card text-left">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Repository
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Start fresh with a new automation repository. Organize your prompts and workflows in one place.
              </p>
            </div>

            <div className="card text-left">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-secondary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Import Repository
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Import an existing automation repository from a URL or file to continue your work.
              </p>
            </div>

            <div className="card text-left">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Execution
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Execute prompts directly with Claude Code for instant automation results.
              </p>
            </div>

            <div className="card text-left">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Collaborate with your team on automation workflows and share best practices.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => onCreateRepository('', '')}
              className="btn-primary px-6 py-3 text-base"
            >
              Create Your First Repository
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="btn-secondary px-6 py-3 text-base"
            >
              Import Repository
            </button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Import Repository
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="import-url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Repository URL
                </label>
                <input
                  id="import-url"
                  type="text"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="input"
                  placeholder="https://github.com/user/repo"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a GitHub URL or other repository source
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="btn-primary"
                disabled={!importUrl.trim()}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
