/*
  Warnings:

  - Added the required column `createdById` to the `ScheduledTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."ScheduledTransaction" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "EventLog_userId_idx" ON "public"."EventLog"("userId");

-- CreateIndex
CREATE INDEX "EventLog_accountId_idx" ON "public"."EventLog"("accountId");

-- CreateIndex
CREATE INDEX "EventLog_transactionId_idx" ON "public"."EventLog"("transactionId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "ScheduledTransaction_createdById_idx" ON "public"."ScheduledTransaction"("createdById");

-- AddForeignKey
ALTER TABLE "public"."ScheduledTransaction" ADD CONSTRAINT "ScheduledTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
