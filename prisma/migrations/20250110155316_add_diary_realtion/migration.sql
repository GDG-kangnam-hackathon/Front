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
    "recommendationId" TEXT,
    CONSTRAINT "Diary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Diary_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Diary" ("content", "date", "emotionScore", "emotionType", "id", "reason", "userId") SELECT "content", "date", "emotionScore", "emotionType", "id", "reason", "userId" FROM "Diary";
DROP TABLE "Diary";
ALTER TABLE "new_Diary" RENAME TO "Diary";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
