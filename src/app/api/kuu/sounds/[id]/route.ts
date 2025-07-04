import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'auth_token';

// 音声ファイルの削除
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const soundId = parseInt(params.id);
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

    // ファイルの削除
    const filePath = join(process.cwd(), 'public', sound.filePath);
    try {
      if (existsSync(filePath)) {
        console.log(`Deleting file: ${filePath}`);
        await unlink(filePath);
        console.log(`File deleted successfully: ${filePath}`);
      } else {
        console.log(`File not found, skipping deletion: ${filePath}`);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // ファイル削除に失敗してもデータベースからは削除を続行
      console.log('Continuing with database deletion despite file deletion error');
    }

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