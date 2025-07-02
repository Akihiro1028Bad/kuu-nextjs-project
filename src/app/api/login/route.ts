import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'メールアドレスとパスワードを入力してください。' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'メールアドレスまたはパスワードが間違っています。' }, { status: 401 });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: 'メールアドレスまたはパスワードが間違っています。' }, { status: 401 });
    }
    // JWT発行
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: COOKIE_MAX_AGE });
    // Cookieにセット
    const cookie = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    const res = NextResponse.json({
      message: 'ログイン成功',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at,
        profile_image_path: user.profile_image_path,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    });
    res.headers.set('Set-Cookie', cookie);
    return res;
  } catch (e) {
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
} 