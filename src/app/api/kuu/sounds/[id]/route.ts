import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';
// import { unlink } from 'fs/promises';
// import { join } from 'path';
// import { existsSync } from 'fs';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'auth_token';

// 音声ファイルの削除
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const soundId = parseInt(id);
    if (isNaN(soundId)) {
      return NextResponse.json({ message: '無効なIDです' }, { status: 400 });
    }

    // 音声ファイルの存在確認と権限チェック
    const sound = await (prisma as any).kuuSound.findFirst({
      where: {
        id: soundId,
        userId: payload.userId
      }
    });

    if (!sound) {
      return NextResponse.json({ message: '音声ファイルが見つかりません' }, { status: 404 });
    }

    // 物理ファイル削除処理は不要なので削除
    // データベースから削除
    await (prisma as any).kuuSound.delete({
      where: { id: soundId }
    });

    return NextResponse.json({ 
      message: '音声ファイルが削除されました' 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'サーバーエラー', error: String(e) }, { status: 500 });
  }
} 