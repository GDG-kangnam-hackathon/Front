-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Diary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "emotionType" TEXT NOT NULL,
    "emotionScore" INTEGER NOT NULL,
    "reason" TEXT,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Diary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Diary" ("content", "date", "emotionScore", "emotionType", "id", "reason", "userId") SELECT "content", "date", "emotionScore", "emotionType", "id", "reason", "userId" FROM "Diary";
DROP TABLE "Diary";
ALTER TABLE "new_Diary" RENAME TO "Diary";
CREATE TABLE "new_Recommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Recommendation" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "Recommendation";
DROP TABLE "Recommendation";
ALTER TABLE "new_Recommendation" RENAME TO "Recommendation";
CREATE TABLE "new_RecommendationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectorId" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "jobDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RecommendationJob_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "RecommendationSector" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RecommendationJob" ("createdAt", "id", "jobDescription", "jobName", "sectorId", "updatedAt") SELECT "createdAt", "id", "jobDescription", "jobName", "sectorId", "updatedAt" FROM "RecommendationJob";
DROP TABLE "RecommendationJob";
ALTER TABLE "new_RecommendationJob" RENAME TO "RecommendationJob";
CREATE TABLE "new_RecommendationSector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recommendationId" TEXT NOT NULL,
    "sectorName" TEXT NOT NULL,
    "fitPercentage" REAL NOT NULL,
    "reasoning" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RecommendationSector_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RecommendationSector" ("createdAt", "fitPercentage", "id", "reasoning", "recommendationId", "sectorName", "updatedAt") SELECT "createdAt", "fitPercentage", "id", "reasoning", "recommendationId", "sectorName", "updatedAt" FROM "RecommendationSector";
DROP TABLE "RecommendationSector";
ALTER TABLE "new_RecommendationSector" RENAME TO "RecommendationSector";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
