import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        if (!name || !email || !password) {
        return NextResponse.json({ message: '全ての項目を入力してください。' }, { status: 400 });
        }
        // 既存ユーザー確認
        const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
            return NextResponse.json({ message: 'このメールアドレスは既に登録されています。' }, { status: 409 });
            }
        // パスワードハッシュ化
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
            },
        });
        // レベル1の称号を取得
        const firstTitle = await prisma.kuuTitle.findUnique({ where: { level: 1 } });
        // kuuStatusを作成
        await prisma.kuuStatus.create({
            data: {
                userId: user.id,
                kuuCount: 0,
                level: 1,
                titleId: firstTitle!.id,
            },
        });
        return NextResponse.json({ message: '登録完了', user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at, updated_at: user.updated_at } });
    } catch (e) {
        return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
    }
} 