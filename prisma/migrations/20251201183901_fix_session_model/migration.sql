-- DropIndex
DROP INDEX "Session_sid_key";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "sid" DROP NOT NULL;
