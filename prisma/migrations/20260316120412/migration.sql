-- CreateTable
CREATE TABLE "barangays" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "barangays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_cover_timeseries" (
    "barangayId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "water" DOUBLE PRECISION NOT NULL,
    "trees" DOUBLE PRECISION NOT NULL,
    "grass" DOUBLE PRECISION NOT NULL,
    "floodedVegetation" DOUBLE PRECISION NOT NULL,
    "crops" DOUBLE PRECISION NOT NULL,
    "shrub" DOUBLE PRECISION NOT NULL,
    "snow" DOUBLE PRECISION NOT NULL,
    "built" DOUBLE PRECISION NOT NULL,
    "bare" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "land_cover_timeseries_pkey" PRIMARY KEY ("barangayId","quarter","year")
);

-- CreateTable
CREATE TABLE "land_cover_image_data" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "imageBinary" BYTEA NOT NULL,
    "contentType" TEXT NOT NULL,

    CONSTRAINT "land_cover_image_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "land_cover_timeseries" ADD CONSTRAINT "land_cover_timeseries_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "barangays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
