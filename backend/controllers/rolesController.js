// backend/controllers/rolesController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/v1/roles
 * Devuelve todos los roles ordenados por id asc.
 */
async function getAllRoles(req, res, next) {
  try {
    const roles = await prisma.rol.findMany({ orderBy: { id: 'asc' } });
    res.json(roles);
  } catch (err) {
    console.error('❌ Error en getAllRoles:', err);
    next(err);
  }
}

module.exports = {
  getAllRoles
};
