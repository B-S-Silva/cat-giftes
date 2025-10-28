-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" TEXT;

-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "category" TEXT;
