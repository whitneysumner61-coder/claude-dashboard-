'use client';

import { useState, useRef, useEffect } from 'react';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import type { ClaudeCodeIntegration, ClaudeMessage } from '@/types';
import TaskStatusCard from './TaskStatusCard';

interface ClaudeCodePanelProps {
  connection: ClaudeCodeIntegration;
  onSendMessage: (message: string) => void;
  onTaskCancel: (taskId: string) => void;
  onTaskRetry: (taskId: string) => void;
}

export default function ClaudeCodePanel({
  connection,
  onSendMessage,
  onTaskCancel,
  onTaskRetry,
}: ClaudeCodePanelProps) {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [connection.conversationHistory]);

  const handleSendMessage = () => {
    if (messageInput.trim() && connection.connectionStatus === 'connected') {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <aside className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Claude Code</h2>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                getStatusColor(connection.connectionStatus)
              )}
            />
            <span className="text-xs text-gray-600 capitalize">
              {connection.connectionStatus}
            </span>
          </div>
        </div>

        {connection.sessionId && (
          <p className="text-xs text-gray-500">
            Session: {connection.sessionId.slice(0, 8)}...
          </p>
        )}

        {/* Resource Usage */}
        {connection.connectionStatus === 'connected' && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded p-2">
              <div className="text-xs text-gray-600">CPU</div>
              <div className="text-sm font-medium text-gray-900">
                {connection.resourceUsage.cpu}%
              </div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-xs text-gray-600">Memory</div>
              <div className="text-sm font-medium text-gray-900">
                {connection.resourceUsage.memory}MB
              </div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-xs text-gray-600">Disk</div>
              <div className="text-sm font-medium text-gray-900">
                {connection.resourceUsage.disk}MB
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {connection.conversationHistory.length === 0 ? (
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p className="text-sm text-gray-500">No conversation yet</p>
            <p className="text-xs text-gray-400 mt-1">
              {connection.connectionStatus === 'connected'
                ? 'Send a message to start'
                : 'Connect to Claude to begin'}
            </p>
          </div>
        ) : (
          <>
            {connection.conversationHistory.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={conversationEndRef} />
          </>
        )}
      </div>

      {/* Current Task */}
      {connection.currentTask && (
        <div className="border-t border-gray-200 p-4">
          <TaskStatusCard
            task={connection.currentTask}
            onCancel={onTaskCancel}
            onRetry={onTaskRetry}
          />
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              connection.connectionStatus === 'connected'
                ? 'Type a message to Claude...'
                : 'Connect to Claude first...'
            }
            className="input resize-none"
            rows={3}
            disabled={connection.connectionStatus !== 'connected'}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Press Enter to send, Shift+Enter for new line
            </span>
            <button
              onClick={handleSendMessage}
              disabled={
                !messageInput.trim() ||
                connection.connectionStatus !== 'connected'
              }
              className="btn-primary"
            >
              Send
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
            Debug Help
          </button>
          <button className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
            Code Review
          </button>
          <button className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
            Optimize
          </button>
        </div>
      </div>
    </aside>
  );
}

function MessageBubble({ message }: { message: ClaudeMessage }) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'message-bubble max-w-[85%]',
          isUser ? 'user' : 'claude'
        )}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        <div
          className={cn(
            'text-xs mt-1',
            isUser ? 'text-blue-100' : 'text-gray-500'
          )}
        >
          {formatDate(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="message-bubble claude">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        </div>
      </div>
    </div>
  );
}
