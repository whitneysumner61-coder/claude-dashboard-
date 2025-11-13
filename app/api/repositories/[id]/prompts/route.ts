import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompts = await prisma.automationPrompt.findMany({
      where: {
        repositoryId: params.id,
      },
      include: {
        resources: true,
        dependencies: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      items: prompts.map((prompt) => ({
        ...prompt,
        resourcesRequired: prompt.resources[0] || {
          cpu: 1,
          memory: 512,
          disk: 1024,
          timeout: 3600,
        },
        dependencies: prompt.dependencies.map((d) => d.dependencyId),
        lastModified: prompt.updatedAt,
      })),
      total: prompts.length,
    });
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      category,
      complexity,
      estimatedRuntime,
      resourcesRequired,
      dependencies,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const prompt = await prisma.automationPrompt.create({
      data: {
        title,
        content,
        category: category || 'general',
        complexity: complexity?.toUpperCase() || 'BASIC',
        estimatedRuntime: estimatedRuntime || 60,
        repositoryId: params.id,
        version: '1.0.0',
      },
    });

    // Create resource requirements
    if (resourcesRequired) {
      await prisma.resourceRequirement.create({
        data: {
          promptId: prompt.id,
          cpu: resourcesRequired.cpu || 1,
          memory: resourcesRequired.memory || 512,
          disk: resourcesRequired.disk || 1024,
          timeout: resourcesRequired.timeout || 3600,
        },
      });
    }

    // Create dependencies
    if (dependencies && Array.isArray(dependencies)) {
      await Promise.all(
        dependencies.map((depId) =>
          prisma.promptDependency.create({
            data: {
              promptId: prompt.id,
              dependencyId: depId,
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      data: prompt,
    });
  } catch (error) {
    console.error('Failed to create prompt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
