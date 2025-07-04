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

    const sounds = await (prisma as any).kuuSound.findMany({
      where: { 
        userId: payload.userId,
        isActive: true 
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

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

// 音声ファイルのアップロード
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

    // ファイル名の生成
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `kuu_${payload.userId}_${timestamp}.${fileExtension}`;
    
    // アップロードディレクトリの作成
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'sounds');
    
    try {
      // ディレクトリが存在しない場合は作成
      if (!existsSync(uploadDir)) {
        console.log(`Creating directory: ${uploadDir}`);
        await mkdir(uploadDir, { recursive: true });
        console.log(`Directory created successfully: ${uploadDir}`);
      } else {
        console.log(`Directory already exists: ${uploadDir}`);
      }
    } catch (dirError) {
      console.error('Error creating directory:', dirError);
      return NextResponse.json({ 
        message: 'ディレクトリの作成に失敗しました', 
        error: String(dirError) 
      }, { status: 500 });
    }

    // ファイルの保存
    const filePath = join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // データベースに保存
    const sound = await (prisma as any).kuuSound.create({
      data: {
        userId: payload.userId,
        name: name,
        filePath: `/uploads/sounds/${fileName}`,
        duration: null, // 後で音声の長さを取得する機能を追加可能
      }
    });

    return NextResponse.json({ 
      message: '音声ファイルがアップロードされました',
      sound 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'サーバーエラー', error: String(e) }, { status: 500 });
  }
} 