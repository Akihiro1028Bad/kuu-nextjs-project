import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'auth_token';

// 音声ファイルの取得
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

    // クエリパラメータを取得
    const url = req.nextUrl;
    const withFileData = url.searchParams.get('withFileData') === '1';
    const limit = url.searchParams.get('limit');
    const offset = url.searchParams.get('offset') || '0';
    const userOnly = url.searchParams.get('userOnly') === '1'; // ユーザー固有の音声のみ取得

    // クエリ条件を構築
    const where: any = { isActive: true };
    if (userOnly) {
      where.userId = payload.userId; // ログインユーザーの音声のみ
    }
    const take = limit ? parseInt(limit) : undefined;
    const skip = parseInt(offset);

    const sounds = await (prisma as any).kuuSound.findMany({
      where,
      select: withFileData ? {
        id: true,
        name: true,
        createdAt: true,
        duration: true,
        fileData: true,
        user: { select: { name: true } }
      } : {
        id: true,
        name: true,
        createdAt: true,
        duration: true,
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });

    // fileDataはwithFileData=1のときのみ返す
    return NextResponse.json({ sounds });
  } catch (e) {
    console.error('GET /api/kuu/sounds error:', e);
    return NextResponse.json({ 
      message: 'サーバーエラー', 
      error: String(e),
      details: e instanceof Error ? e.stack : 'Unknown error'
    }, { status: 500 });
  }
}

// 録音データ保存専用のPOSTメソッドを復活
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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    if (!file || !name) {
      return NextResponse.json({ message: 'ファイルと名前が必要です' }, { status: 400 });
    }
    // ファイル形式の検証
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ message: '音声ファイルのみアップロード可能です' }, { status: 400 });
    }
    // ファイルサイズの制限（10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'ファイルサイズは10MB以下にしてください' }, { status: 400 });
    }
    // ファイルデータをBase64エンコード
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    // データベースに保存
    const sound = await (prisma as any).kuuSound.create({
      data: {
        userId: payload.userId,
        name: name,
        fileData: base64Data,
        duration: null,
      }
    });
    return NextResponse.json({ 
      message: '録音が保存されました',
      sound 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'サーバーエラー', error: String(e) }, { status: 500 });
  }
} 