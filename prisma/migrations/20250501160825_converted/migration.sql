/*
  Warnings:

  - The `regionalMetrics` column on the `LanguageInsight` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `vitalityTrends` column on the `LanguageInsight` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LanguageInsight" DROP COLUMN "regionalMetrics",
ADD COLUMN     "regionalMetrics" JSONB[],
DROP COLUMN "vitalityTrends",
ADD COLUMN     "vitalityTrends" JSONB[];
