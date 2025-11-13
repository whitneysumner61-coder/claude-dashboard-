import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { getRedisClient } from '../lib/redis';
import prisma from '../lib/prisma';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

// Store active Claude sessions
const activeSessions = new Map<string, any>();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Claude Code connection
  socket.on('claude:connect', async (data) => {
    try {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create session in database
      const session = await prisma.claudeSession.create({
        data: {
          userId: data.userId,
          sessionId,
          status: 'CONNECTED',
        },
      });

      activeSessions.set(sessionId, {
        socketId: socket.id,
        userId: data.userId,
        connectedAt: new Date(),
      });

      socket.emit('claude:connected', {
        sessionId,
        status: 'connected',
      });

      console.log(`Claude session created: ${sessionId}`);
    } catch (error) {
      console.error('Failed to create Claude session:', error);
      socket.emit('claude:error', { message: 'Failed to connect to Claude' });
    }
  });

  // Claude Code message
  socket.on('claude:message', async (data) => {
    try {
      const { sessionId, message } = data;

      // Store message in database
      await prisma.claudeMessage.create({
        data: {
          sessionId,
          sender: 'USER',
          content: message,
        },
      });

      // Emit message to Claude (in production, this would integrate with actual Claude API)
      socket.emit('claude:message', {
        id: `msg-${Date.now()}`,
        sender: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Simulate Claude response (in production, replace with actual Claude API call)
      setTimeout(() => {
        const claudeResponse = {
          id: `msg-${Date.now()}`,
          sender: 'claude',
          content: `Received your message: "${message}". This is a simulated response.`,
          timestamp: new Date(),
        };

        socket.emit('claude:message', claudeResponse);

        // Store Claude response
        prisma.claudeMessage.create({
          data: {
            sessionId,
            sender: 'CLAUDE',
            content: claudeResponse.content,
          },
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to process Claude message:', error);
      socket.emit('claude:error', { message: 'Failed to send message' });
    }
  });

  // Execute prompt
  socket.on('prompt:execute', async (data) => {
    try {
      const { promptId, parameters, executionId } = data;

      // Get prompt details
      const prompt = await prisma.automationPrompt.findUnique({
        where: { id: promptId },
        include: {
          resources: true,
        },
      });

      if (!prompt) {
        socket.emit('task:failed', {
          taskId: executionId,
          error: 'Prompt not found',
        });
        return;
      }

      // Create execution record
      const execution = await prisma.execution.create({
        data: {
          promptId,
          repositoryId: prompt.repositoryId,
          userId: data.userId || 'default-user',
          status: 'RUNNING',
          progress: 0,
        },
      });

      // Emit task started
      socket.emit('task:started', {
        id: execution.id,
        prompt,
        status: 'running',
        progress: 0,
        logs: [],
        startTime: new Date(),
        endTime: null,
        resourcesAllocated: prompt.resources[0] || {
          cpu: 1,
          memory: 512,
          disk: 1024,
        },
      });

      // Simulate execution progress
      let progress = 0;
      const interval = setInterval(async () => {
        progress += 10;

        // Update execution in database
        await prisma.execution.update({
          where: { id: execution.id },
          data: { progress: progress / 100 },
        });

        // Create log entry
        const logEntry = await prisma.executionLog.create({
          data: {
            executionId: execution.id,
            level: 'INFO',
            message: `Progress: ${progress}%`,
          },
        });

        socket.emit('task:progress', {
          taskId: execution.id,
          progress,
          logEntry: {
            id: logEntry.id,
            timestamp: logEntry.timestamp,
            level: logEntry.level.toLowerCase(),
            message: logEntry.message,
          },
        });

        if (progress >= 100) {
          clearInterval(interval);

          // Update execution as completed
          await prisma.execution.update({
            where: { id: execution.id },
            data: {
              status: 'COMPLETED',
              endTime: new Date(),
              output: { success: true, message: 'Execution completed successfully' },
            },
          });

          // Update prompt stats
          await prisma.automationPrompt.update({
            where: { id: promptId },
            data: {
              executionCount: { increment: 1 },
              successRate: (prompt.successRate * prompt.executionCount + 1) / (prompt.executionCount + 1),
            },
          });

          socket.emit('task:completed', {
            taskId: execution.id,
            output: {
              success: true,
              data: { message: 'Execution completed successfully' },
            },
          });
        }
      }, prompt.estimatedRuntime * 100);
    } catch (error) {
      console.error('Failed to execute prompt:', error);
      socket.emit('task:failed', {
        taskId: data.executionId,
        error: 'Execution failed',
      });
    }
  });

  // Task cancellation
  socket.on('task:cancel', async (data) => {
    try {
      const { taskId } = data;

      await prisma.execution.update({
        where: { id: taskId },
        data: {
          status: 'CANCELLED',
          endTime: new Date(),
        },
      });

      socket.emit('task:cancelled', { taskId });
    } catch (error) {
      console.error('Failed to cancel task:', error);
    }
  });

  // Disconnect handler
  socket.on('disconnect', async () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Find and cleanup session
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.socketId === socket.id) {
        await prisma.claudeSession.update({
          where: { sessionId },
          data: {
            status: 'DISCONNECTED',
            endedAt: new Date(),
          },
        });
        activeSessions.delete(sessionId);
        break;
      }
    }
  });
});

const PORT = process.env.WEBSOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`✨ Socket.IO server running on port ${PORT}`);
});

export { app, io };
