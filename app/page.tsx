'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import RepositorySidebar from '@/components/RepositorySidebar';
import RepositoryView from '@/components/RepositoryView';
import ClaudeCodePanel from '@/components/ClaudeCodePanel';
import WelcomeScreen from '@/components/WelcomeScreen';
import NotificationSystem from '@/components/NotificationSystem';
import type { AutomationRepository, ClaudeCodeIntegration } from '@/types';

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<AutomationRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<AutomationRepository | null>(null);
  const [claudeConnection, setClaudeConnection] = useState<ClaudeCodeIntegration>({
    connectionStatus: 'disconnected',
    sessionId: '',
    conversationHistory: [],
    currentTask: null,
    resourceUsage: { cpu: 0, memory: 0, disk: 0 },
    estimatedCompletion: null,
  });

  useEffect(() => {
    // Load repositories from API
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      const response = await fetch('/api/repositories');
      if (response.ok) {
        const data = await response.json();
        setRepositories(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load repositories:', error);
    }
  };

  const handleCreateRepository = async (name: string, description: string) => {
    try {
      const response = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        const newRepo = await response.json();
        setRepositories([...repositories, newRepo]);
        setSelectedRepo(newRepo);
      }
    } catch (error) {
      console.error('Failed to create repository:', error);
    }
  };

  const handleImportRepository = async (url: string) => {
    // Import repository logic
    console.log('Importing repository from:', url);
  };

  const handleConnectClaude = async () => {
    try {
      setClaudeConnection({
        ...claudeConnection,
        connectionStatus: 'connecting',
      });

      const response = await fetch('/api/claude/connect', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setClaudeConnection({
          ...claudeConnection,
          connectionStatus: 'connected',
          sessionId: data.sessionId,
        });
      }
    } catch (error) {
      console.error('Failed to connect to Claude:', error);
      setClaudeConnection({
        ...claudeConnection,
        connectionStatus: 'disconnected',
      });
    }
  };

  const handleTaskExecution = async (promptId: string, parameters?: any) => {
    try {
      const response = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, parameters }),
      });

      if (response.ok) {
        const task = await response.json();
        setClaudeConnection({
          ...claudeConnection,
          currentTask: task,
        });
      }
    } catch (error) {
      console.error('Failed to execute task:', error);
    }
  };

  const handleClaudeMessage = async (message: string) => {
    // Send message to Claude
    console.log('Sending message to Claude:', message);
  };

  const handleTaskCancel = async (taskId: string) => {
    // Cancel task
    console.log('Cancelling task:', taskId);
  };

  const handleTaskRetry = async (taskId: string) => {
    // Retry task
    console.log('Retrying task:', taskId);
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader
        onNewRepository={handleCreateRepository}
        onConnectClaude={handleConnectClaude}
        connectionStatus={claudeConnection.connectionStatus}
      />

      <div className="dashboard-content">
        <RepositorySidebar
          repositories={repositories}
          selectedRepo={selectedRepo}
          onRepoSelect={setSelectedRepo}
          onRepoCreate={handleCreateRepository}
        />

        <main className="main-content">
          {selectedRepo ? (
            <RepositoryView
              repository={selectedRepo}
              claudeConnection={claudeConnection}
              onTaskExecute={handleTaskExecution}
            />
          ) : (
            <WelcomeScreen
              onCreateRepository={handleCreateRepository}
              onImportRepository={handleImportRepository}
            />
          )}
        </main>

        <ClaudeCodePanel
          connection={claudeConnection}
          onSendMessage={handleClaudeMessage}
          onTaskCancel={handleTaskCancel}
          onTaskRetry={handleTaskRetry}
        />
      </div>

      <NotificationSystem />
    </div>
  );
}
