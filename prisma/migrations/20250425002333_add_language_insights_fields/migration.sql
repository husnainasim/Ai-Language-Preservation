-- CreateTable
CREATE TABLE "LanguageInsight" (
    "id" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "learningDifficulty" TEXT NOT NULL,
    "preservationStatus" TEXT NOT NULL,
    "availableResources" JSONB NOT NULL,
    "activeLearnersCount" INTEGER NOT NULL,
    "nativeSpeakersCount" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextUpdate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "LanguageInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LanguageInsight_languageId_key" ON "LanguageInsight"("languageId");

-- CreateIndex
CREATE INDEX "LanguageInsight_languageId_idx" ON "LanguageInsight"("languageId");

-- AddForeignKey
ALTER TABLE "LanguageInsight" ADD CONSTRAINT "LanguageInsight_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageInsight" ADD CONSTRAINT "LanguageInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
