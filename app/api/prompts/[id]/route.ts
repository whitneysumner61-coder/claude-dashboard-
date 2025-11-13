import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = await prisma.automationPrompt.findUnique({
      where: { id: params.id },
      include: {
        resources: true,
        dependencies: true,
      },
    });

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...prompt,
        resourcesRequired: prompt.resources[0],
        dependencies: prompt.dependencies.map((d) => d.dependencyId),
      },
    });
  } catch (error) {
    console.error('Failed to fetch prompt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const prompt = await prisma.automationPrompt.update({
      where: { id: params.id },
      data: {
        ...body,
        complexity: body.complexity?.toUpperCase(),
      },
    });

    return NextResponse.json({
      success: true,
      data: prompt,
    });
  } catch (error) {
    console.error('Failed to update prompt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.automationPrompt.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Prompt deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete prompt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
}
