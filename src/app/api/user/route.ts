import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
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
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      email_verified_at: user.email_verified_at,
      profile_image_path: user.profile_image_path,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (e) {
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
} 