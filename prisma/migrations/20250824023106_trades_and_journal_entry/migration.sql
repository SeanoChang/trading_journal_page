-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PLAN_AHEAD', 'EXECUTED');

-- CreateEnum
CREATE TYPE "public"."Side" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "public"."WinLoss" AS ENUM ('WIN', 'LOSS', 'BREAKEVEN');

-- CreateEnum
CREATE TYPE "public"."Mood" AS ENUM ('VERY_NEGATIVE', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'VERY_POSITIVE');

-- CreateTable
CREATE TABLE "public"."Trade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pair" TEXT NOT NULL,
    "orderStatus" "public"."OrderStatus" NOT NULL,
    "side" "public"."Side" NOT NULL,
    "limitPrice" DOUBLE PRECISION,
    "takeProfit" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    "entryPrice" DOUBLE PRECISION,
    "exitPrice" DOUBLE PRECISION,
    "entryTime" TIMESTAMP(3),
    "exitTime" TIMESTAMP(3),
    "pnl" DOUBLE PRECISION,
    "winLoss" "public"."WinLoss",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "content" TEXT,
    "mood" "public"."Mood",
    "confidence" INTEGER,
    "winRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JournalTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#3B82F6',

    CONSTRAINT "JournalTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Setup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Setup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_JournalEntryToJournalTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JournalEntryToJournalTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_JournalEntryToSetup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JournalEntryToSetup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_JournalEntryToTrade" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JournalEntryToTrade_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "JournalEntry_userId_date_idx" ON "public"."JournalEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "JournalTag_name_key" ON "public"."JournalTag"("name");

-- CreateIndex
CREATE INDEX "JournalTag_name_idx" ON "public"."JournalTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setup_name_key" ON "public"."Setup"("name");

-- CreateIndex
CREATE INDEX "Setup_name_idx" ON "public"."Setup"("name");

-- CreateIndex
CREATE INDEX "_JournalEntryToJournalTag_B_index" ON "public"."_JournalEntryToJournalTag"("B");

-- CreateIndex
CREATE INDEX "_JournalEntryToSetup_B_index" ON "public"."_JournalEntryToSetup"("B");

-- CreateIndex
CREATE INDEX "_JournalEntryToTrade_B_index" ON "public"."_JournalEntryToTrade"("B");

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_JournalEntryToJournalTag" ADD CONSTRAINT "_JournalEntryToJournalTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_JournalEntryToJournalTag" ADD CONSTRAINT "_JournalEntryToJournalTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."JournalTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_JournalEntryToSetup" ADD CONSTRAINT "_JournalEntryToSetup_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_JournalEntryToSetup" ADD CONSTRAINT "_JournalEntryToSetup_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Setup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_JournalEntryToTrade" ADD CONSTRAINT "_JournalEntryToTrade_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_JournalEntryToTrade" ADD CONSTRAINT "_JournalEntryToTrade_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
