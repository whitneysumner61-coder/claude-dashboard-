import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const repositories = await prisma.repository.findMany({
      include: {
        prompts: true,
        branches: true,
        collaborators: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      items: repositories.map((repo) => ({
        ...repo,
        collaborators: repo.collaborators.map((c) => c.user),
      })),
      total: repositories.length,
    });
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Repository name is required' },
        { status: 400 }
      );
    }

    const repository = await prisma.repository.create({
      data: {
        name,
        description,
        status: 'ACTIVE',
      },
    });

    // Create default main branch
    await prisma.branch.create({
      data: {
        name: 'main',
        repositoryId: repository.id,
        isDefault: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: repository,
    });
  } catch (error) {
    console.error('Failed to create repository:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create repository' },
      { status: 500 }
    );
  }
}
