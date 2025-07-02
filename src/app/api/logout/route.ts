import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

const COOKIE_NAME = 'auth_token';

export async function POST(req: NextRequest) {
  // Cookieを即時失効させる
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  const res = NextResponse.json({ message: 'ログアウトしました' });
  res.headers.set('Set-Cookie', cookie);
  return res;
} 