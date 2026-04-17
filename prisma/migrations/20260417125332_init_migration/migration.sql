-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('not_started', 'training', 'trained');

-- CreateEnum
CREATE TYPE "InferenceStatus" AS ENUM ('not_started', 'completed');

-- CreateTable
CREATE TABLE "LandCoverTimeSeries" (
    "barangay_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "bare_ground" DOUBLE PRECISION NOT NULL,
    "build_area" DOUBLE PRECISION NOT NULL,
    "crops" DOUBLE PRECISION NOT NULL,
    "grass" DOUBLE PRECISION NOT NULL,
    "shrub_and_scrub" DOUBLE PRECISION NOT NULL,
    "trees" DOUBLE PRECISION NOT NULL,
    "water" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LandCoverTimeSeries_pkey" PRIMARY KEY ("barangay_id","year","quarter")
);

-- CreateTable
CREATE TABLE "LandCoverImages" (
    "year" INTEGER NOT NULL,
    "raw_satellite_imageURL" TEXT NOT NULL,
    "dynamic_world_image_URL" TEXT NOT NULL,

    CONSTRAINT "LandCoverImages_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "ModelsStatus" (
    "model_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "forecast_year" INTEGER,
    "training_status" "TrainingStatus" NOT NULL DEFAULT 'not_started',
    "inference_status" "InferenceStatus",

    CONSTRAINT "ModelsStatus_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "ModelsPerformance" (
    "id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "iou" DOUBLE PRECISION,
    "mae" DOUBLE PRECISION,
    "rmse" DOUBLE PRECISION,
    "crps" DOUBLE PRECISION,
    "residual_analysis" TEXT,
    "training_date" TIMESTAMP(3),

    CONSTRAINT "ModelsPerformance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModelsPerformance" ADD CONSTRAINT "ModelsPerformance_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "ModelsStatus"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;
