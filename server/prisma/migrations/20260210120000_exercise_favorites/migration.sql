-- CreateTable
CREATE TABLE "ExerciseFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExerciseFavorite_userId_idx" ON "ExerciseFavorite"("userId");

-- CreateIndex
CREATE INDEX "ExerciseFavorite_exerciseId_idx" ON "ExerciseFavorite"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseFavorite_userId_exerciseId_key" ON "ExerciseFavorite"("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "ExerciseFavorite" ADD CONSTRAINT "ExerciseFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseFavorite" ADD CONSTRAINT "ExerciseFavorite_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

