-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "location" DROP NOT NULL;
