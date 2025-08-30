/*
  Warnings:

  - You are about to drop the column `furnished` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `parking` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `petFriendly` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `security` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `wifi` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "furnished",
DROP COLUMN "parking",
DROP COLUMN "petFriendly",
DROP COLUMN "security",
DROP COLUMN "wifi";

-- CreateTable
CREATE TABLE "public"."Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ListingAmenity" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "ListingAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "public"."Amenity"("name");

-- AddForeignKey
ALTER TABLE "public"."ListingAmenity" ADD CONSTRAINT "ListingAmenity_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingAmenity" ADD CONSTRAINT "ListingAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "public"."Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
