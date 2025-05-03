/*
  Warnings:

  - Added the required column `regionalMetrics` to the `LanguageInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vitalityTrends` to the `LanguageInsight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LanguageInsight" ADD COLUMN     "regionalMetrics" JSONB NOT NULL,
ADD COLUMN     "vitalityTrends" JSONB NOT NULL;
