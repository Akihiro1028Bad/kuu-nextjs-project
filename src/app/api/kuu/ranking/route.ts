import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 総件数を取得
    const totalCount = await prisma.kuuStatus.count();
    const totalPages = Math.ceil(totalCount / limit);

    // ランキングデータを取得（kuuCountの多い順）
    const rankings = await prisma.kuuStatus.findMany({
      orderBy: {
        kuuCount: 'desc',
      },
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        title: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
    });

    // ランキング形式に整形
    const rankingData = rankings.map((status, index) => ({
      rank: offset + index + 1,
      userId: status.user.id,
      userName: status.user.name,
      kuuCount: status.kuuCount,
      level: status.level,
      title: status.title.name,
      titleLevel: status.title.level,
    }));

    return NextResponse.json({
      rankings: rankingData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (e) {
    console.error('Ranking API error:', e);
    return NextResponse.json(
      { message: 'ランキングの取得に失敗しました', error: String(e) },
      { status: 500 }
    );
  }
} 