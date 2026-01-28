-- CreateTable
CREATE TABLE "paddles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "weightOz" DOUBLE PRECISION,
    "gripCircumference" DOUBLE PRECISION,
    "coreMaterial" TEXT,
    "faceMaterial" TEXT,
    "shape" TEXT,
    "balancePointMm" INTEGER,
    "powerRating" INTEGER,
    "controlRating" INTEGER,
    "spinRating" INTEGER,
    "sweetSpotSize" TEXT,
    "swingWeight" INTEGER,
    "twistWeight" INTEGER,
    "handleLengthIn" DOUBLE PRECISION,
    "usapaApproved" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "affiliateUrls" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paddles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "conditions" TEXT,
    "weightMappings" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_responses" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "partnerId" TEXT,
    "responses" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "partnerType" TEXT NOT NULL,
    "revSharePercent" INTEGER NOT NULL DEFAULT 60,
    "logoUrl" TEXT,
    "primaryColor" TEXT DEFAULT '#2563eb',
    "secondaryColor" TEXT DEFAULT '#ffffff',
    "embedType" TEXT NOT NULL DEFAULT 'inline',
    "customDomain" TEXT,
    "allowedDomains" TEXT,
    "curatedPaddles" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_analytics" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "quizStarts" INTEGER NOT NULL DEFAULT 0,
    "quizCompletions" INTEGER NOT NULL DEFAULT 0,
    "dropoffs" INTEGER NOT NULL DEFAULT 0,
    "avgTimeSeconds" INTEGER,
    "resultsViewed" INTEGER NOT NULL DEFAULT 0,
    "paddleClicks" INTEGER NOT NULL DEFAULT 0,
    "purchaseClicks" INTEGER NOT NULL DEFAULT 0,
    "shareAttempts" INTEGER NOT NULL DEFAULT 0,
    "shareCompletes" INTEGER NOT NULL DEFAULT 0,
    "viralVisits" INTEGER NOT NULL DEFAULT 0,
    "attributedSales" INTEGER NOT NULL DEFAULT 0,
    "revenueUsdCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_shares" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "partnerId" TEXT,
    "userId" TEXT,
    "platform" TEXT NOT NULL,
    "shareUrl" TEXT,
    "resultCardUrl" TEXT,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attributed_sales" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "paddleId" TEXT,
    "retailer" TEXT NOT NULL,
    "saleAmountCents" INTEGER NOT NULL,
    "commissionCents" INTEGER NOT NULL,
    "partnerShareCents" INTEGER NOT NULL,
    "ourShareCents" INTEGER NOT NULL,
    "affiliateNetwork" TEXT NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attributed_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embed_events" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT,
    "sessionId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embed_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_questions_questionKey_key" ON "quiz_questions"("questionKey");

-- CreateIndex
CREATE UNIQUE INDEX "partners_apiKey_key" ON "partners"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "partners_email_key" ON "partners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "partner_analytics_partnerId_date_key" ON "partner_analytics"("partnerId", "date");

-- CreateIndex
CREATE INDEX "embed_events_partnerId_createdAt_idx" ON "embed_events"("partnerId", "createdAt");

-- CreateIndex
CREATE INDEX "embed_events_sessionId_idx" ON "embed_events"("sessionId");

-- AddForeignKey
ALTER TABLE "quiz_responses" ADD CONSTRAINT "quiz_responses_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_analytics" ADD CONSTRAINT "partner_analytics_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_shares" ADD CONSTRAINT "social_shares_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributed_sales" ADD CONSTRAINT "attributed_sales_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
