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
    "affiliateUrls" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paddles_pkey" PRIMARY KEY ("id")
);
