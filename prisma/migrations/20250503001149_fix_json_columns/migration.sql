/*
  Warnings:

  - Changed the type of `vitalityTrends` on the `LanguageInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LanguageInsight" DROP COLUMN "vitalityTrends",
ADD COLUMN     "vitalityTrends" JSONB NOT NULL;
