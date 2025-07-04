/*
  Warnings:

  - You are about to drop the column `filePath` on the `KuuSound` table. All the data in the column will be lost.
  - Added the required column `fileData` to the `KuuSound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KuuSound" DROP COLUMN "filePath",
ADD COLUMN     "fileData" TEXT NOT NULL;
