-- CreateTable
CREATE TABLE `calendario` (
    `fecha` DATETIME(3) NOT NULL,
    `diaSemana` VARCHAR(191) NOT NULL,
    `mes` INTEGER NOT NULL,
    `trimestre` INTEGER NOT NULL,
    `anio` INTEGER NOT NULL,
    `esFinDeSemana` BOOLEAN NOT NULL,

    PRIMARY KEY (`fecha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_cambios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `archivoId` INTEGER NOT NULL,
    `filaId` INTEGER NOT NULL,
    `transformacion` VARCHAR(191) NOT NULL,
    `aplicadoPor` INTEGER NOT NULL,
    `aplicadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `historial_cambios_aplicadoPor_idx`(`aplicadoPor`),
    INDEX `historial_cambios_archivoId_idx`(`archivoId`),
    INDEX `historial_cambios_filaId_idx`(`filaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `segmento` ENUM('B2B', 'B2C', 'PREMIUM') NOT NULL,
    `regionId` VARCHAR(191) NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleado` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `departamento` ENUM('VENTAS', 'LOGISTICA', 'ATENCION_CLIENTE') NOT NULL,
    `jefeId` VARCHAR(191) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `empleado_jefeId_idx`(`jefeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreArchivo` VARCHAR(191) NOT NULL,
    `tipoArchivo` VARCHAR(191) NOT NULL,
    `subidoPor` INTEGER NOT NULL,
    `subidoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('CARGADO', 'PROCESANDO', 'VALIDADO', 'ERROR') NOT NULL,

    INDEX `archivo_subidoPor_idx`(`subidoPor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `producto` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `categoriaId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('PIZZA', 'BEBIDA') NOT NULL,
    `precioBase` DOUBLE NOT NULL,
    `costo` DOUBLE NOT NULL,
    `margen` DOUBLE NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `producto_categoriaId_idx`(`categoriaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `datos_crudos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `archivoId` INTEGER NOT NULL,
    `numeroFila` INTEGER NOT NULL,
    `datosJson` JSON NOT NULL,
    `estadoValidacion` ENUM('PENDIENTE', 'VALIDO', 'INVALIDO', 'CORREGIDO') NOT NULL,
    `mensajeError` VARCHAR(191) NULL,

    INDEX `datos_crudos_archivoId_idx`(`archivoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region` (
    `id` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `coordenadas` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` ENUM('ADMIN', 'GERENTE', 'ANALISTA', 'USUARIO') NOT NULL,

    UNIQUE INDEX `rol_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sala_venta` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venta` (
    `id` VARCHAR(191) NOT NULL,
    `fechaVenta` DATETIME(3) NOT NULL,
    `productoId` VARCHAR(191) NOT NULL,
    `clienteId` VARCHAR(191) NOT NULL,
    `empleadoId` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `descuento` DOUBLE NULL,
    `metodoPago` ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA') NOT NULL,
    `regionId` VARCHAR(191) NOT NULL,
    `salaVentaId` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `venta_clienteId_idx`(`clienteId`),
    INDEX `venta_empleadoId_idx`(`empleadoId`),
    INDEX `venta_productoId_idx`(`productoId`),
    INDEX `venta_regionId_idx`(`regionId`),
    INDEX `venta_fechaVenta_idx`(`fechaVenta`),
    INDEX `venta_usuarioId_idx`(`usuarioId`),
    INDEX `venta_salaVentaId_idx`(`salaVentaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiraEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sesion_token_key`(`token`),
    INDEX `sesion_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `rolId` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuario_correo_key`(`correo`),
    INDEX `usuario_rolId_idx`(`rolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `datos_validados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `archivoId` INTEGER NOT NULL,
    `ventaId` VARCHAR(191) NULL,
    `fechaVenta` DATETIME(3) NOT NULL,
    `productoId` VARCHAR(191) NULL,
    `nombreProducto` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio` DOUBLE NOT NULL,
    `clienteId` VARCHAR(191) NULL,
    `nombreCliente` VARCHAR(191) NULL,
    `regionId` VARCHAR(191) NULL,
    `nombreRegion` VARCHAR(191) NULL,

    INDEX `datos_validados_clienteId_idx`(`clienteId`),
    INDEX `datos_validados_archivoId_idx`(`archivoId`),
    INDEX `datos_validados_productoId_idx`(`productoId`),
    INDEX `datos_validados_regionId_idx`(`regionId`),
    INDEX `datos_validados_ventaId_idx`(`ventaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `historial_cambios` ADD CONSTRAINT `historial_cambios_aplicadoPor_fkey` FOREIGN KEY (`aplicadoPor`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_cambios` ADD CONSTRAINT `historial_cambios_archivoId_fkey` FOREIGN KEY (`archivoId`) REFERENCES `archivo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_cambios` ADD CONSTRAINT `historial_cambios_filaId_fkey` FOREIGN KEY (`filaId`) REFERENCES `datos_crudos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cliente` ADD CONSTRAINT `cliente_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empleado` ADD CONSTRAINT `empleado_jefeId_fkey` FOREIGN KEY (`jefeId`) REFERENCES `empleado`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archivo` ADD CONSTRAINT `archivo_subidoPor_fkey` FOREIGN KEY (`subidoPor`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `producto` ADD CONSTRAINT `producto_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datos_crudos` ADD CONSTRAINT `datos_crudos_archivoId_fkey` FOREIGN KEY (`archivoId`) REFERENCES `archivo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_empleadoId_fkey` FOREIGN KEY (`empleadoId`) REFERENCES `empleado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_fechaVenta_fkey` FOREIGN KEY (`fechaVenta`) REFERENCES `calendario`(`fecha`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_salaVentaId_fkey` FOREIGN KEY (`salaVentaId`) REFERENCES `sala_venta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesion` ADD CONSTRAINT `sesion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datos_validados` ADD CONSTRAINT `datos_validados_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datos_validados` ADD CONSTRAINT `datos_validados_archivoId_fkey` FOREIGN KEY (`archivoId`) REFERENCES `archivo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datos_validados` ADD CONSTRAINT `datos_validados_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datos_validados` ADD CONSTRAINT `datos_validados_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datos_validados` ADD CONSTRAINT `datos_validados_ventaId_fkey` FOREIGN KEY (`ventaId`) REFERENCES `venta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
