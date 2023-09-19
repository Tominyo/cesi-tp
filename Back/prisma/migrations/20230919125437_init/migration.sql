-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lodging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "colorId" TEXT NOT NULL,
    CONSTRAINT "Lodging_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lodging" ("colorId", "id", "name") SELECT "colorId", "id", "name" FROM "Lodging";
DROP TABLE "Lodging";
ALTER TABLE "new_Lodging" RENAME TO "Lodging";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
