-- CreateTable
CREATE TABLE "OrderReceiptDesign" (
    "id" SERIAL NOT NULL,
    "global" BOOLEAN NOT NULL DEFAULT false,
    "application" INTEGER NOT NULL,
    "logo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "paragraph" TEXT NOT NULL,
    "design" JSONB NOT NULL,

    CONSTRAINT "OrderReceiptDesign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderReceiptDesign" ADD CONSTRAINT "OrderReceiptDesign_application_fkey" FOREIGN KEY ("application") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
