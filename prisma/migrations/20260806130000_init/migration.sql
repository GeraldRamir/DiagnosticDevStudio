-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NUEVO', 'CONTACTADO', 'EN_CONVERSACION', 'PROPUESTA_ENVIADA', 'CERRADO_GANADO', 'CERRADO_PERDIDO');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "hasWebsite" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "instagramHandle" TEXT,
    "orderChannel" TEXT[],
    "recordKeeping" TEXT NOT NULL,
    "biggestTimeWaster" TEXT NOT NULL,
    "weeklyHoursOnAdmin" TEXT NOT NULL,
    "teamSize" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "source" TEXT,
    "campaign" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NUEVO',
    "notes" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "globalScore" INTEGER NOT NULL,
    "scoreLabel" TEXT NOT NULL,
    "pillarScores" JSONB NOT NULL,
    "signals" JSONB NOT NULL,
    "technicalRaw" JSONB,
    "hoursLost" JSONB NOT NULL,
    "narrative" JSONB NOT NULL,
    "analysisStatus" TEXT NOT NULL DEFAULT 'completo',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "pdfDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "callBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_slug_key" ON "Lead"("slug");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Report_leadId_key" ON "Report"("leadId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
