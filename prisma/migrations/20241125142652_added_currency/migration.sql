-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('GEL', 'USD');

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'GEL';
