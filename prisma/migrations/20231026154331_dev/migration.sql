-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "products" JSONB NOT NULL DEFAULT '[]',
    "price" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "application" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_application_fkey" FOREIGN KEY ("application") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
