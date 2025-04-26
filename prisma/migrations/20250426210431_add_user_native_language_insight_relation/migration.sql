/*
  Warnings:

  - You are about to drop the column `userId` on the `LanguageInsight` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[languageId]` on the table `LanguageInsight` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nativeLanguage]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "LanguageInsight" DROP CONSTRAINT "LanguageInsight_userId_fkey";

-- AlterTable
ALTER TABLE "LanguageInsight" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "LanguageInsight_languageId_key" ON "LanguageInsight"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nativeLanguage_key" ON "User"("nativeLanguage");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_nativeLanguage_fkey" FOREIGN KEY ("nativeLanguage") REFERENCES "LanguageInsight"("languageId") ON DELETE SET NULL ON UPDATE CASCADE;
