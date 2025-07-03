-- CreateTable
CREATE TABLE "KuuTitle" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KuuTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KuuStatus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "kuuCount" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "titleId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KuuStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KuuTitle_level_key" ON "KuuTitle"("level");

-- CreateIndex
CREATE UNIQUE INDEX "KuuStatus_userId_key" ON "KuuStatus"("userId");

-- AddForeignKey
ALTER TABLE "KuuStatus" ADD CONSTRAINT "KuuStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KuuStatus" ADD CONSTRAINT "KuuStatus_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "KuuTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
