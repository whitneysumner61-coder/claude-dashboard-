import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const executions = await prisma.execution.findMany({
      where: {
        repositoryId: params.id,
      },
      include: {
        prompt: true,
        user: true,
      },
      orderBy: {
        startTime: 'desc',
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      items: executions.map((execution) => ({
        id: execution.id,
        promptId: execution.promptId,
        promptTitle: execution.prompt.title,
        userId: execution.userId,
        userName: execution.user.name,
        status: execution.status.toLowerCase(),
        startTime: execution.startTime,
        endTime: execution.endTime,
        duration: execution.endTime
          ? Math.floor(
              (execution.endTime.getTime() - execution.startTime.getTime()) / 1000
            )
          : null,
        output: execution.output,
      })),
      total: executions.length,
    });
  } catch (error) {
    console.error('Failed to fetch executions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}
