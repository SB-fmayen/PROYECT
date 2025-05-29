/*
  Warnings:

  - You are about to drop the column `costo` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the column `margen` on the `producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `producto` DROP COLUMN `costo`,
    DROP COLUMN `margen`,
    ADD COLUMN `precioVenta` DOUBLE NOT NULL DEFAULT 0;
