import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'auth_token';

export async function GET(req: NextRequest) {
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
    const kuuStatus = await prisma.kuuStatus.findUnique({
      where: { userId: payload.userId },
      include: { title: true },
    });
    if (!kuuStatus) {
      return NextResponse.json({ message: 'No kuu status found.' }, { status: 404 });
    }
    return NextResponse.json({
      kuuCount: kuuStatus.kuuCount,
      level: kuuStatus.level,
      title: kuuStatus.title.name,
      titleLevel: kuuStatus.title.level,
      updatedAt: kuuStatus.updatedAt,
    });
  } catch (e) {
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
} 