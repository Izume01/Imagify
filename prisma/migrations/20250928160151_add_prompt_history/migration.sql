-- CreateTable
CREATE TABLE "PromptHistory" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "imageCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptHistory_pkey" PRIMARY KEY ("id")
);
