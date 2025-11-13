'use client';

import { useState } from 'react';
import { cn, getComplexityColor } from '@/lib/utils';
import type { AutomationPrompt } from '@/types';

interface PromptEditorProps {
  prompt: AutomationPrompt;
  onSave: (prompt: Partial<AutomationPrompt>) => void;
  onExecute: (promptId: string, parameters?: any) => void;
}

export default function PromptEditor({ prompt, onSave, onExecute }: PromptEditorProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'preview'>('view');
  const [editedPrompt, setEditedPrompt] = useState(prompt);

  const handleSave = () => {
    onSave(editedPrompt);
    setMode('view');
  };

  const handleCancel = () => {
    setEditedPrompt(prompt);
    setMode('view');
  };

  return (
    <div className="card h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex-1">
          {mode === 'edit' ? (
            <input
              type="text"
              value={editedPrompt.title}
              onChange={(e) =>
                setEditedPrompt({ ...editedPrompt, title: e.target.value })
              }
              className="text-2xl font-bold text-gray-900 w-full border-b border-gray-300 focus:border-primary-500 outline-none"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">{prompt.title}</h2>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {mode === 'view' && (
            <>
              <button onClick={() => setMode('edit')} className="btn-secondary">
                Edit
              </button>
              <button
                onClick={() => onExecute(prompt.id)}
                className="btn-primary"
              >
                Execute
              </button>
            </>
          )}
          {mode === 'edit' && (
            <>
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary">
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setMode('view')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-t-lg',
            mode === 'view'
              ? 'bg-white border-t border-x border-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          View
        </button>
        <button
          onClick={() => setMode('edit')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-t-lg',
            mode === 'edit'
              ? 'bg-white border-t border-x border-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Edit
        </button>
        <button
          onClick={() => setMode('preview')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-t-lg',
            mode === 'preview'
              ? 'bg-white border-t border-x border-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Preview
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        {mode === 'view' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Content
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                {prompt.content}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Category
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                  {prompt.category}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Complexity
                </h3>
                <span
                  className={cn(
                    'complexity-badge text-xs',
                    getComplexityColor(prompt.complexity)
                  )}
                >
                  {prompt.complexity}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Estimated Runtime
                </h3>
                <p className="text-sm text-gray-900">
                  {prompt.estimatedRuntime} seconds
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Version
                </h3>
                <p className="text-sm text-gray-900">v{prompt.version}</p>
              </div>
            </div>

            {prompt.resourcesRequired && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Resource Requirements
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600">CPU</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {prompt.resourcesRequired.cpu} cores
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600">Memory</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {prompt.resourcesRequired.memory}MB
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600">Disk</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {prompt.resourcesRequired.disk}MB
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs text-gray-600">Total Executions</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {prompt.executionCount}
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs text-gray-600">Success Rate</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(prompt.successRate * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={editedPrompt.content}
                onChange={(e) =>
                  setEditedPrompt({ ...editedPrompt, content: e.target.value })
                }
                className="input font-mono text-sm"
                rows={15}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={editedPrompt.category}
                  onChange={(e) =>
                    setEditedPrompt({ ...editedPrompt, category: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complexity
                </label>
                <select
                  value={editedPrompt.complexity}
                  onChange={(e) =>
                    setEditedPrompt({
                      ...editedPrompt,
                      complexity: e.target.value as AutomationPrompt['complexity'],
                    })
                  }
                  className="input"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Runtime (seconds)
                </label>
                <input
                  type="number"
                  value={editedPrompt.estimatedRuntime}
                  onChange={(e) =>
                    setEditedPrompt({
                      ...editedPrompt,
                      estimatedRuntime: parseInt(e.target.value),
                    })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={editedPrompt.version}
                  onChange={(e) =>
                    setEditedPrompt({ ...editedPrompt, version: e.target.value })
                  }
                  className="input"
                />
              </div>
            </div>
          </div>
        )}

        {mode === 'preview' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Preview Mode
              </h3>
              <p className="text-sm text-blue-700">
                This is how your prompt will appear when executed.
              </p>
            </div>

            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              <div className="text-green-400 mb-2">$ Executing prompt...</div>
              <div className="whitespace-pre-wrap">{prompt.content}</div>
              <div className="text-gray-500 mt-4">
                [Estimated duration: {prompt.estimatedRuntime}s]
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
