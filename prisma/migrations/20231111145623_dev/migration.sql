-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "application" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_application_fkey" FOREIGN KEY ("application") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
