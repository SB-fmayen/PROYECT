/*
  Warnings:

  - You are about to drop the column `fechaRegistro` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `segmento` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the `archivo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `datos_crudos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `datos_validados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historial_cambios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `archivo` DROP FOREIGN KEY `archivo_subidoPor_fkey`;

-- DropForeignKey
ALTER TABLE `datos_crudos` DROP FOREIGN KEY `datos_crudos_archivoId_fkey`;

-- DropForeignKey
ALTER TABLE `datos_validados` DROP FOREIGN KEY `datos_validados_archivoId_fkey`;

-- DropForeignKey
ALTER TABLE `datos_validados` DROP FOREIGN KEY `datos_validados_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `datos_validados` DROP FOREIGN KEY `datos_validados_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `datos_validados` DROP FOREIGN KEY `datos_validados_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `datos_validados` DROP FOREIGN KEY `datos_validados_ventaId_fkey`;

-- DropForeignKey
ALTER TABLE `historial_cambios` DROP FOREIGN KEY `historial_cambios_aplicadoPor_fkey`;

-- DropForeignKey
ALTER TABLE `historial_cambios` DROP FOREIGN KEY `historial_cambios_archivoId_fkey`;

-- DropForeignKey
ALTER TABLE `historial_cambios` DROP FOREIGN KEY `historial_cambios_filaId_fkey`;

-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `fechaRegistro`,
    DROP COLUMN `segmento`;

-- DropTable
DROP TABLE `archivo`;

-- DropTable
DROP TABLE `datos_crudos`;

-- DropTable
DROP TABLE `datos_validados`;

-- DropTable
DROP TABLE `historial_cambios`;
