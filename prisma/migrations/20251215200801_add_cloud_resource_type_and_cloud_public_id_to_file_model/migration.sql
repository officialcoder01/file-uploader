/*
  Warnings:

  - You are about to drop the column `localPath` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_slug_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "localPath",
DROP COLUMN "slug",
DROP COLUMN "url",
ADD COLUMN     "cloudPublicId" TEXT,
ADD COLUMN     "cloudResourceType" TEXT;
