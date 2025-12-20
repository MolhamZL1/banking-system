-- CreateEnum
CREATE TYPE "public"."AccountFeatureType" AS ENUM ('PREMIUM', 'INSURANCE', 'OVERDRAFT_PLUS');

-- CreateTable
CREATE TABLE "public"."AccountFeature" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "type" "public"."AccountFeatureType" NOT NULL,
    "numberValue" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountFeature_accountId_idx" ON "public"."AccountFeature"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountFeature_accountId_type_key" ON "public"."AccountFeature"("accountId", "type");

-- AddForeignKey
ALTER TABLE "public"."AccountFeature" ADD CONSTRAINT "AccountFeature_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
