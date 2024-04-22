-- CreateTable
CREATE TABLE "ProductsOnNewArrival" (
    "productId" TEXT NOT NULL,
    "NewArrivalId" TEXT NOT NULL,

    CONSTRAINT "ProductsOnNewArrival_pkey" PRIMARY KEY ("productId","NewArrivalId")
);

-- CreateTable
CREATE TABLE "NewArrival" (
    "id" TEXT NOT NULL,

    CONSTRAINT "NewArrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOnSwiper" (
    "productId" TEXT NOT NULL,
    "productSwiperId" TEXT NOT NULL,

    CONSTRAINT "ProductOnSwiper_pkey" PRIMARY KEY ("productId","productSwiperId")
);

-- CreateTable
CREATE TABLE "ProductsSwiper" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ProductsSwiper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductsOnNewArrival" ADD CONSTRAINT "ProductsOnNewArrival_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnNewArrival" ADD CONSTRAINT "ProductsOnNewArrival_NewArrivalId_fkey" FOREIGN KEY ("NewArrivalId") REFERENCES "NewArrival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnSwiper" ADD CONSTRAINT "ProductOnSwiper_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnSwiper" ADD CONSTRAINT "ProductOnSwiper_productSwiperId_fkey" FOREIGN KEY ("productSwiperId") REFERENCES "ProductsSwiper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
