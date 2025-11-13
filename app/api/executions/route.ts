import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { promptId, parameters } = body;

    if (!promptId) {
      return NextResponse.json(
        { success: false, error: 'Prompt ID is required' },
        { status: 400 }
      );
    }

    const prompt = await prisma.automationPrompt.findUnique({
      where: { id: promptId },
      include: {
        resources: true,
      },
    });

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Create execution record (actual execution happens via WebSocket)
    const execution = await prisma.execution.create({
      data: {
        promptId,
        repositoryId: prompt.repositoryId,
        userId: 'default-user', // In production, get from auth session
        status: 'QUEUED',
        progress: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: execution.id,
        prompt,
        status: 'queued',
        progress: 0,
        logs: [],
        startTime: execution.startTime,
        endTime: null,
        resourcesAllocated: prompt.resources[0] || {
          cpu: 1,
          memory: 512,
          disk: 1024,
        },
      },
    });
  } catch (error) {
    console.error('Failed to create execution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create execution' },
      { status: 500 }
    );
  }
}
