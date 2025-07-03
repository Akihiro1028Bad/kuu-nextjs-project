import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'auth_token';

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) {
      return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
    }
    let payload: any;
    try {
      payload = jwt.verify(cookie, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
    }
    // ユーザーのKuuStatusを取得
    let kuuStatus = await prisma.kuuStatus.findUnique({
      where: { userId: payload.userId },
      include: { title: true },
    });
    if (!kuuStatus) {
      // 初回の場合はレベル1の称号をセット
      const firstTitle = await prisma.kuuTitle.findUnique({ where: { level: 1 } });
      kuuStatus = await prisma.kuuStatus.create({
        data: {
          userId: payload.userId,
          kuuCount: 1,
          level: 1,
          titleId: firstTitle!.id,
        },
        include: { title: true },
      });
      return NextResponse.json({
        kuuCount: kuuStatus.kuuCount,
        level: kuuStatus.level,
        title: kuuStatus.title.name,
        titleLevel: kuuStatus.title.level,
        updatedAt: kuuStatus.updatedAt,
      });
    }
    // カウントアップ
    const newCount = kuuStatus.kuuCount + 1;
    let newLevel = kuuStatus.level;
    let newTitleId = kuuStatus.titleId;
    // レベルアップ条件（例: 10回ごとにレベルアップ）
    const levelUpThreshold = 10;
    if (newCount >= (kuuStatus.level * levelUpThreshold)) {
      newLevel = kuuStatus.level + 1;
      // 新しい称号を取得（なければ現状維持）
      const newTitle = await prisma.kuuTitle.findUnique({ where: { level: newLevel } });
      if (newTitle) {
        newTitleId = newTitle.id;
      }
    }
    const updated = await prisma.kuuStatus.update({
      where: { id: kuuStatus.id },
      data: {
        kuuCount: newCount,
        level: newLevel,
        titleId: newTitleId,
      },
      include: { title: true },
    });
    return NextResponse.json({
      kuuCount: updated.kuuCount,
      level: updated.level,
      title: updated.title.name,
      titleLevel: updated.title.level,
      updatedAt: updated.updatedAt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'サーバーエラー', error: String(e) }, { status: 500 });
  }
} 