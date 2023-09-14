/*
  Warnings:

  - The primary key for the `Option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Color` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Option" ("id", "isActive", "name") SELECT "id", "isActive", "name" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE UNIQUE INDEX "Option_name_key" ON "Option"("name");
CREATE TABLE "new_Lodging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    CONSTRAINT "Lodging_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lodging" ("colorId", "id", "name") SELECT "colorId", "id", "name" FROM "Lodging";
DROP TABLE "Lodging";
ALTER TABLE "new_Lodging" RENAME TO "Lodging";
CREATE TABLE "new_Color" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hex" TEXT NOT NULL DEFAULT '#FFFFFF'
);
INSERT INTO "new_Color" ("hex", "id", "name") SELECT "hex", "id", "name" FROM "Color";
DROP TABLE "Color";
ALTER TABLE "new_Color" RENAME TO "Color";
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");
CREATE TABLE "new__LodgingToOption" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LodgingToOption_A_fkey" FOREIGN KEY ("A") REFERENCES "Lodging" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LodgingToOption_B_fkey" FOREIGN KEY ("B") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__LodgingToOption" ("A", "B") SELECT "A", "B" FROM "_LodgingToOption";
DROP TABLE "_LodgingToOption";
ALTER TABLE "new__LodgingToOption" RENAME TO "_LodgingToOption";
CREATE UNIQUE INDEX "_LodgingToOption_AB_unique" ON "_LodgingToOption"("A", "B");
CREATE INDEX "_LodgingToOption_B_index" ON "_LodgingToOption"("B");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
