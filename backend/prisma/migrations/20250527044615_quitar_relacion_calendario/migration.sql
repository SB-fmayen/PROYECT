/*
  Warnings:

  - You are about to drop the `calendario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `venta` DROP FOREIGN KEY `venta_fechaVenta_fkey`;

-- DropTable
DROP TABLE `calendario`;
