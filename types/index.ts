// Core Type Definitions for AutoFlow Commander

export interface AutomationRepository {
  id: string;
  name: string;
  description: string;
  prompts: AutomationPrompt[];
  branches: RepositoryBranch[];
  collaborators: User[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived' | 'draft';
}

export interface AutomationPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'enterprise';
  estimatedRuntime: number;
  resourcesRequired: ResourceRequirements;
  dependencies: string[];
  version: string;
  createdAt: Date;
  lastModified: Date;
  executionCount: number;
  successRate: number;
}

export interface ResourceRequirements {
  cpu: number;
  memory: number;
  disk: number;
  timeout: number;
}

export interface RepositoryBranch {
  id: string;
  name: string;
  repositoryId: string;
  isDefault: boolean;
  commits: Commit[];
  headCommitId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commit {
  id: string;
  message: string;
  author: User;
  timestamp: Date;
  changes: CommitChange[];
  parentCommitId: string | null;
}

export interface CommitChange {
  id: string;
  promptId: string;
  changeType: 'create' | 'update' | 'delete';
  diff: string;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: Date;
}

export interface ClaudeCodeIntegration {
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  sessionId: string;
  conversationHistory: ClaudeMessage[];
  currentTask: ActiveTask | null;
  resourceUsage: ResourceMetrics;
  estimatedCompletion: Date | null;
}

export interface ClaudeMessage {
  id: string;
  sender: 'user' | 'claude' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ActiveTask {
  id: string;
  prompt: AutomationPrompt;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  logs: TaskLog[];
  output: TaskOutput | null;
  startTime: Date;
  endTime: Date | null;
  resourcesAllocated: ResourceAllocation;
}

export interface TaskLog {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
}

export interface TaskOutput {
  success: boolean;
  data?: any;
  errorMessage?: string;
  artifacts?: string[];
}

export interface ResourceAllocation {
  cpu: number;
  memory: number;
  disk: number;
}

export interface ResourceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  timestamp?: Date;
}

export interface ExecutionHistory {
  id: string;
  promptId: string;
  promptTitle: string;
  userId: string;
  userName: string;
  status: ActiveTask['status'];
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  output?: TaskOutput;
}

export interface Activity {
  id: string;
  repositoryId: string;
  userId: string;
  userName: string;
  activityType: ActivityType;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type ActivityType =
  | 'repository_created'
  | 'repository_updated'
  | 'prompt_created'
  | 'prompt_updated'
  | 'prompt_deleted'
  | 'execution_started'
  | 'execution_completed'
  | 'execution_failed'
  | 'branch_created'
  | 'branch_merged'
  | 'commit_created'
  | 'collaborator_added'
  | 'collaborator_removed';

export interface Permission {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canExecute: boolean;
  canShare: boolean;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'clarity' | 'efficiency' | 'structure' | 'best-practice';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  originalText: string;
  suggestedText: string;
}

export interface PromptBlock {
  id: string;
  type: 'input' | 'processing' | 'output' | 'condition' | 'loop';
  title: string;
  content: string;
  parameters: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

export interface PromptCanvas {
  blocks: PromptBlock[];
  connections: Connection[];
  variables: Variable[];
}

export interface Connection {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface Variable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue: any;
  description: string;
}

// WebSocket Events
export interface WebSocketEvents {
  // Connection events
  'connection:established': void;
  'connection:lost': void;

  // Claude Code events
  'claude:status': { status: ClaudeCodeIntegration['connectionStatus']; sessionId?: string };
  'claude:message': ClaudeMessage;

  // Task events
  'task:status': { task: ActiveTask; status: ActiveTask['status'] };
  'task:progress': { taskId: string; progress: number; logEntry?: TaskLog };
  'task:completed': { taskId: string; output: TaskOutput };
  'task:failed': { taskId: string; error: string };

  // Repository events
  'repository:sync': AutomationRepository;
  'repository:updated': { repositoryId: string; changes: any };

  // Execution events
  'execution:added': ExecutionHistory;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form types
export interface CreateRepositoryInput {
  name: string;
  description?: string;
}

export interface CreatePromptInput {
  title: string;
  content: string;
  category: string;
  complexity: AutomationPrompt['complexity'];
  estimatedRuntime: number;
  resourcesRequired: ResourceRequirements;
  dependencies?: string[];
}

export interface UpdatePromptInput extends Partial<CreatePromptInput> {
  id: string;
}

export interface ExecutePromptInput {
  promptId: string;
  parameters?: Record<string, any>;
}

export interface CreateBranchInput {
  name: string;
  repositoryId: string;
  fromBranch?: string;
}

export interface MergeBranchInput {
  repositoryId: string;
  sourceBranch: string;
  targetBranch: string;
}

export interface CommitInput {
  repositoryId: string;
  branchName: string;
  message: string;
  changes: Array<{
    promptId: string;
    changeType: CommitChange['changeType'];
    diff: string;
  }>;
}
