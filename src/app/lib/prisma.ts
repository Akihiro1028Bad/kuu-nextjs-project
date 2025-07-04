import { PrismaClient } from '@prisma/client';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 音声フォルダの初期化
async function initializeAudioDirectories() {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'sounds');
    
    if (!existsSync(uploadDir)) {
      console.log(`Initializing audio directory: ${uploadDir}`);
      await mkdir(uploadDir, { recursive: true });
      console.log(`Audio directory created: ${uploadDir}`);
    } else {
      console.log(`Audio directory already exists: ${uploadDir}`);
    }
  } catch (error) {
    console.error('Error initializing audio directories:', error);
  }
}

// アプリケーション起動時にディレクトリを初期化
if (typeof window === 'undefined') {
  initializeAudioDirectories();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 