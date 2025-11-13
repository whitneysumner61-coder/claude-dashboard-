'use client';

import { useState, useEffect } from 'react';
import { getComplexityColor } from '@/lib/utils';
import type { AutomationRepository, ClaudeCodeIntegration, AutomationPrompt } from '@/types';
import PromptCard from './PromptCard';
import PromptEditor from './PromptEditor';
import ExecutionHistory from './ExecutionHistory';

interface RepositoryViewProps {
  repository: AutomationRepository;
  claudeConnection: ClaudeCodeIntegration;
  onTaskExecute: (promptId: string, parameters?: any) => void;
}

export default function RepositoryView({
  repository,
  claudeConnection,
  onTaskExecute,
}: RepositoryViewProps) {
  const [prompts, setPrompts] = useState<AutomationPrompt[]>(repository.prompts || []);
  const [selectedPrompt, setSelectedPrompt] = useState<AutomationPrompt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showNewPromptModal, setShowNewPromptModal] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, [repository.id]);

  const loadPrompts = async () => {
    try {
      const response = await fetch(`/api/repositories/${repository.id}/prompts`);
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  const handleNewPrompt = () => {
    setShowNewPromptModal(true);
  };

  const handlePromptSave = async (prompt: Partial<AutomationPrompt>) => {
    try {
      const response = await fetch(`/api/repositories/${repository.id}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
      });

      if (response.ok) {
        const newPrompt = await response.json();
        setPrompts([...prompts, newPrompt]);
        setSelectedPrompt(newPrompt);
        setShowNewPromptModal(false);
      }
    } catch (error) {
      console.error('Failed to create prompt:', error);
    }
  };

  const handlePromptEdit = (prompt: AutomationPrompt) => {
    setSelectedPrompt(prompt);
  };

  const handlePromptDelete = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrompts(prompts.filter((p) => p.id !== promptId));
        if (selectedPrompt?.id === promptId) {
          setSelectedPrompt(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  };

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || prompt.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(prompts.map((p) => p.category)));

  return (
    <div className="h-full flex flex-col">
      {/* Repository Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{repository.name}</h1>
        {repository.description && (
          <p className="text-gray-600 mt-1">{repository.description}</p>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 flex-1">
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-md"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={handleNewPrompt} className="btn-primary">
            + New Prompt
          </button>
          <button className="btn-secondary">Import Prompts</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Prompt List */}
        <div className="w-96 overflow-y-auto">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
              <p className="text-sm text-gray-500">No prompts found</p>
              <button onClick={handleNewPrompt} className="btn-primary mt-4">
                Create Your First Prompt
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isSelected={selectedPrompt?.id === prompt.id}
                  onSelect={setSelectedPrompt}
                  onExecute={onTaskExecute}
                  onEdit={handlePromptEdit}
                  onDelete={handlePromptDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Prompt Editor/Viewer */}
        <div className="flex-1 overflow-y-auto">
          {selectedPrompt ? (
            <PromptEditor
              prompt={selectedPrompt}
              onSave={handlePromptSave}
              onExecute={onTaskExecute}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg
                  className="w-20 h-20 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                <p className="text-lg text-gray-500">Select a prompt to view details</p>
                <p className="text-sm text-gray-400 mt-1">
                  or create a new one to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution History */}
      <div className="mt-6 border-t pt-6">
        <ExecutionHistory repositoryId={repository.id} />
      </div>
    </div>
  );
}
