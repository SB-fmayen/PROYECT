// backend/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/v1/users
 * Obtiene usuarios con filtros opcionales.
 */
async function getUsuarios(req, res) {
  try {
    const { name, email, roleId, isActive, createdFrom, createdTo } = req.query;

    const filters = {
      nombre: name      ? { contains: name.trim() } : undefined,
      correo: email     ? { contains: email.trim() } : undefined,
      rolId: roleId     ? Number(roleId)          : undefined,
      activo:
        isActive !== undefined && isActive !== ''
          ? isActive === '1'
          : undefined,
      creadoEn:
        createdFrom && createdTo
          ? {
              gte: new Date(createdFrom + 'T00:00:00Z'),
              lte: new Date(createdTo   + 'T23:59:59Z'),
            }
          : undefined,
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    const usuarios = await prisma.usuario.findMany({
      where: cleanFilters,
      include: { rol: true },
      orderBy: { creadoEn: 'desc' },
    });

    const resultado = usuarios.map(u => ({
      id:           u.id,
      nombre:       u.nombre,
      correo:       u.correo,
      rol:          u.rol.nombre,
      activo:       u.activo,
      creadoEn:     u.creadoEn,
      actualizadoEn:u.actualizadoEn,
    }));

    res.json(resultado);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

/**
 * POST /api/v1/users
 * Crea un nuevo usuario.
 */
async function createUsuario(req, res) {
  try {
    const { nombre, correo, rolId, activo } = req.body;
    if (!nombre || !correo || rolId == null) {
      return res
        .status(400)
        .json({ message: 'Faltan datos obligatorios: nombre, correo, rolId' });
    }

    const nuevo = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        rolId:   Number(rolId),
        activo:  Boolean(activo),
        // contrasena: 'default123'  // si necesitas
      },
    });

    const usuarioConRol = await prisma.usuario.findUnique({
      where: { id: nuevo.id },
      include: { rol: true },
    });

    res.status(201).json({
      id:           usuarioConRol.id,
      nombre:       usuarioConRol.nombre,
      correo:       usuarioConRol.correo,
      rol:          usuarioConRol.rol.nombre,
      activo:       usuarioConRol.activo,
      creadoEn:     usuarioConRol.creadoEn,
      actualizadoEn:usuarioConRol.actualizadoEn,
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

/**
 * PUT /api/v1/users/:id
 * Actualiza un usuario existente.
 */
async function updateUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const { nombre, correo, rolId, activo } = req.body;

    if (!nombre || !correo || rolId == null) {
      return res
        .status(400)
        .json({ error: 'Faltan datos obligatorios: nombre, correo, rolId' });
    }

    const actualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nombre,
        correo,
        rolId:   Number(rolId),
        activo:  Boolean(activo),
      },
    });

    res.json({
      id:           actualizado.id,
      nombre:       actualizado.nombre,
      correo:       actualizado.correo,
      rol:          actualizado.rolId, // si quieres nombre, haz include: {rol:true}
      activo:       actualizado.activo,
      creadoEn:     actualizado.creadoEn,
      actualizadoEn:actualizado.actualizadoEn,
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

/**
 * DELETE /api/v1/users/:id
 * Elimina un usuario por ID.
 */
async function deleteUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.usuario.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error al borrar usuario:', error);
    res.status(500).json({ error: 'Error al borrar usuario' });
  }
}

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
