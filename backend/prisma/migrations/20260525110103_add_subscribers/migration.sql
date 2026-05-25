-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_chatId_key" ON "Subscriber"("chatId");
