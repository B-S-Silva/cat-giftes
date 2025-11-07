-- CreateTable
CREATE TABLE "CustomDate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT 'bg-pink-500',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomDate" ADD CONSTRAINT "CustomDate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
