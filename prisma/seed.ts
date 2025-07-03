import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const titles = [
    { level: 1, name: 'くぅー見習い' },
    { level: 2, name: 'くぅー初心者' },
    { level: 3, name: 'くぅー愛好家' },
    { level: 4, name: 'ほっこりくぅーさん' },
    { level: 5, name: '癒やしのくぅー使い' },
    { level: 6, name: '心のくぅーマスター' },
    { level: 7, name: '伝説のくぅー' },
  ];
  for (const t of titles) {
    await prisma.kuuTitle.upsert({
      where: { level: t.level },
      update: {},
      create: t,
    });
  }
  console.log('KuuTitle seed complete!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 